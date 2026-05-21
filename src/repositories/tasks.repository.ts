import { prisma } from "../prisma/prisma"
import { Priority, Status } from "../prisma/generated/prisma/client"

export interface CreateTaskDTO {
  title: string
  description?: string
  dueDate?: Date
  priority: Priority
  createdById: number
  projectId?: number
}

export interface FindManyTasksDTO {
  projectId: number
  userId?: number
  isAdmin: boolean
  page: number
  limit: number
  status?: Status
  priority?: Priority
  dueDateFrom?: Date
  dueDateTo?: Date
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
  dueDate?: Date | null
  status?: Status
}

export const tasksRepository = {
  async create(data: CreateTaskDTO) {
    return await prisma.task.create({
      data: { ...data, status: Status.PENDENTE }
    })
  },

  async findById(id: number) {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        assignees: { select: { id: true } }
      }
    })
  },

  async findMany({ projectId, userId, isAdmin, page, limit, status, priority, dueDateFrom, dueDateTo }: FindManyTasksDTO) {
    const skip = (page - 1) * limit

    const where: any = {
      projectId,
      ...(!isAdmin && userId ? { assignees: { some: { id: userId } } } : {}),
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(dueDateFrom || dueDateTo ? {
        dueDate: {
          ...(dueDateFrom ? { gte: dueDateFrom } : {}),
          ...(dueDateTo ? { lte: dueDateTo } : {})
        }
      } : {})
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.task.count({ where })
    ])

    return { tasks, total, page, limit }
  },

  async addAssignees(taskId: number, userIds: number[]) {
    return await prisma.task.update({
      where: { id: taskId },
      data: { assignees: { connect: userIds.map(id => ({ id })) } },
      include: {
        assignees: { select: { id: true, name: true, email: true, createdAt: true } }
      }
    })
  },

  async validateUserIds(userIds: number[]) {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true }
    })
    return users.map(u => u.id)
  },

  async update(id: number, data: UpdateTaskDTO) {
    return await prisma.task.update({ where: { id }, data })
  },

  async complete(id: number) {
    return await prisma.task.update({
      where: { id },
      data: { status: Status.CONCLUIDA }
    })
  },

  async reopen(id: number) {
    return await prisma.task.update({
      where: { id },
      data: { status: Status.PENDENTE }
    })
  },

  async isAssignee(taskId: number, userId: number) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, assignees: { some: { id: userId } } }
    })
    return !!task
  }
}