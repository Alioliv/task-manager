import { prisma } from "../prisma/prisma"
import { Priority, Status } from "../prisma/generated/prisma/client"

export interface CreateTaskDTO {
  title: string
  description?: string
  dueDate?: Date
  priority: Priority
  createdById: number
}

export interface FindManyTasksDTO {
  projectId: number
  userId?: number
  isAdmin: boolean
  page: number
  limit: number
}

export const tasksRepository = {
  async create(data: CreateTaskDTO) {
    return await prisma.task.create({
      data: { ...data, status: Status.PENDENTE }
    })
  },

  async findById(id: string) {
    return await prisma.task.findUnique({
      where: { id }
    })
  },

  async findMany({ projectId, userId, isAdmin, page, limit }: FindManyTasksDTO) {
    const skip = (page - 1) * limit

    const where = {
      projectId,
      ...(!isAdmin && userId ? {
        assignees: { some: { id: userId } }
      } : {})
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.task.count({ where })
    ])

    return { tasks, total, page, limit }
  }
}