import { tasksRepository } from "../repositories/tasks.repository"
import { historyRepository } from "../repositories/history.repository"
import { EventType, Status } from "../prisma/generated/prisma/client"
import type { CreateTaskDTO, FindManyTasksDTO, UpdateTaskDTO } from "../repositories/tasks.repository"

export const tasksService = {
  async create(data: CreateTaskDTO) {
    const task = await tasksRepository.create(data)
    await historyRepository.create(task.id, EventType.CREATED, data.createdById)
    return task
  },

  async addAssignees(taskId: number, userIds: number[], userId: number) {
    const task = await tasksRepository.findById(taskId)
    if (!task) throw new Error("Tarefa não encontrada")

    const foundIds = await tasksRepository.validateUserIds(userIds)
    const notFound = userIds.filter(id => !foundIds.includes(id))
    if (notFound.length > 0) throw new Error(`Usuários não encontrados: ${notFound.join(", ")}`)

    const updated = await tasksRepository.addAssignees(taskId, userIds)
    await historyRepository.create(taskId, EventType.ASSIGNED, userId)
    return updated
  },

  async findMany(params: FindManyTasksDTO) {
    return await tasksRepository.findMany(params)
  },

  async update(taskId: number, data: UpdateTaskDTO, userId: number, isAdmin: boolean) {
    const task = await tasksRepository.findById(taskId)
    if (!task) throw new Error("Tarefa não encontrada")

    const isAssigned = task.assignees.some(a => a.id === userId)
    if (!isAdmin && !isAssigned) throw new Error("Sem permissão para editar esta tarefa")

    if (data.status === Status.CONCLUIDA && task.status === Status.CONCLUIDA) {
      throw new Error("Tarefa já está concluída")
    }

    if (data.status === Status.PENDENTE && task.status !== Status.CONCLUIDA) {
      throw new Error("Apenas tarefas concluídas podem ser reabertas")
    }

    const updated = await tasksRepository.update(taskId, data)

    const eventType = data.status === Status.CONCLUIDA
      ? EventType.COMPLETED
      : data.status === Status.PENDENTE
        ? EventType.REOPENED
        : EventType.UPDATED

    await historyRepository.create(taskId, eventType, userId)
    return updated
  },

  async complete(taskId: number, userId: number, isAdmin: boolean) {
    const task = await tasksRepository.findById(taskId)
    if (!task) throw new Error("Tarefa não encontrada")

    if (task.status === Status.CONCLUIDA) throw new Error("Tarefa já está concluída")

    const isAssigned = task.assignees.some(a => a.id === userId)
    if (!isAdmin && !isAssigned) throw new Error("Sem permissão para concluir esta tarefa")

    const updated = await tasksRepository.complete(taskId)
    await historyRepository.create(taskId, EventType.COMPLETED, userId)
    return updated
  },

  async reopen(taskId: number, userId: number, isAdmin: boolean) {
    const task = await tasksRepository.findById(taskId)
    if (!task) throw new Error("Tarefa não encontrada")

    if (task.status !== Status.CONCLUIDA) throw new Error("Apenas tarefas concluídas podem ser reabertas")

    const isAssigned = task.assignees.some(a => a.id === userId)
    if (!isAdmin && !isAssigned) throw new Error("Sem permissão para reabrir esta tarefa")

    const updated = await tasksRepository.reopen(taskId)
    await historyRepository.create(taskId, EventType.REOPENED, userId)
    return updated
  }
}