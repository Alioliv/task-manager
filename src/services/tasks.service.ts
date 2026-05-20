import { tasksRepository } from "../repositories/tasks.repository"
import { historyRepository } from "../repositories/history.repository"
import { EventType } from "../prisma/generated/prisma/client"
import type { CreateTaskDTO, FindManyTasksDTO } from "../repositories/tasks.repository"

export const tasksService = {
  async create(data: CreateTaskDTO) {
    const task = await tasksRepository.create(data)
    await historyRepository.create(task.id, EventType.CREATED, data.createdById)
    return task
  },

  async addAssignees(taskId: string, userIds: number[], userId: number) {
    const task = await tasksRepository.findById(taskId)
    if (!task) throw new Error("Tarefa não encontrada")

    const foundIds = await tasksRepository.validateUserIds(userIds)
    const notFound = userIds.filter(id => !foundIds.includes(id))
    if (notFound.length > 0) {
      throw new Error(`Usuários não encontrados: ${notFound.join(", ")}`)
    }

    const updated = await tasksRepository.addAssignees(taskId, userIds)
    await historyRepository.create(taskId, EventType.ASSIGNED, userId)
    return updated
  },

  async findMany(params: FindManyTasksDTO) {
    return await tasksRepository.findMany(params)
  }
}