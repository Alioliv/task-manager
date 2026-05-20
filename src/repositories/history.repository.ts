import { prisma } from "../prisma/prisma"
import { EventType } from "../prisma/generated/prisma/client"

export const historyRepository = {
  async create(taskId: string, eventType: EventType) {
    return await prisma.history.create({
      data: { taskId, eventType }
    })
  },

  async findByTaskId(taskId: string) {
    return await prisma.history.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" }
    })
  }
}