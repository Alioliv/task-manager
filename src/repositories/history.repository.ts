import { prisma } from "../prisma/prisma"
import { EventType } from "../prisma/generated/prisma"

export const historyRepository = {
  async create(taskId: string, eventType: EventType, userId?: number) {
    return await prisma.history.create({
      data: { taskId, eventType, userId: userId ?? null }
    })
  },

  async findByTaskId(taskId: string) {
    return await prisma.history.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    })
  },

  async findByTaskIdAndUser(taskId: string, userId: number) {
    return await prisma.history.findMany({
      where: { taskId, userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    })
  },

  async findByTaskIdAndUser(taskId: string, userId: number) {
    return await prisma.history.findMany({
      where: { taskId, userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })
  }
}