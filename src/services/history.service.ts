import { tasksRepository } from "../repositories/tasks.repository"
import { historyRepository } from "../repositories/history.repository"
import { EventType } from "../prisma/generated/prisma"
import type { CreateTaskDTO } from "../repositories/tasks.repository"

interface FindByTaskIdOptions {
  taskId: number
  requesterId: number
  isAdmin: boolean
}

export const HistoryService = {
  async create(data: CreateTaskDTO) {
    const task = await tasksRepository.create(data)
    await historyRepository.create(task.id, EventType.CREATED, data.createdById)
    return task
  },

  async findByTaskId({ taskId, requesterId, isAdmin }: FindByTaskIdOptions) {
    const task = await tasksRepository.findById(taskId)
    if (!task) throw new Error("Tarefa não encontrada")

    if (isAdmin) {
      return await historyRepository.findByTaskId(taskId)
    }

    return await historyRepository.findByTaskIdAndUser(taskId, requesterId)
  }
}