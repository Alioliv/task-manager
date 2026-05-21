import { tasksRepository } from "../repositories/tasks.repository"
import { historyRepository } from "../repositories/history.repository"
import { EventType } from "../prisma/generated/prisma/client"
import type { CreateTaskDTO } from "../repositories/tasks.repository"

export const HistoryService = {
  async create(data: CreateTaskDTO) {
    const task = await tasksRepository.create(data)
    await historyRepository.create(task.id, EventType.CREATED)
    return task
  },

  async findByTaskId(taskId: number) {
    return await historyRepository.findByTaskId(taskId)
  }
}