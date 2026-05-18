import { tasksRepository } from "../repositories/tasks.repository"
import { historyRepository } from "../repositories/history.repository"
import { EventType } from "../prisma/generated/prisma/client"
import type { CreateTaskDTO } from "../repositories/tasks.repository"

export const tasksService = {
  async create(data: CreateTaskDTO) {
    const task = await tasksRepository.create(data)
    await historyRepository.create(task.id, EventType.CREATED)
    return task
  }
}