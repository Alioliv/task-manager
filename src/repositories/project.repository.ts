import type { PrismaClient } from '../prisma/generated/prisma/client'
import type { CreateProjectDto, UpdateProjectDto } from '../common/dtos/project.dto'

export class ProjectRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
    })
  }

  async findByOwnerId(ownerId: number) {
    return this.prisma.project.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(data: CreateProjectDto & { ownerId: number }) {
    return this.prisma.project.create({
      data: {
        title: data.title,
        ...(data.description !== undefined && { description: data.description }),
        knowledgeArea: data.knowledgeArea,
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
        status: data.status ?? 'PLANEJAMENTO',
        ownerId: data.ownerId,
      }
    })
  }

  async update(id: string, data: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.knowledgeArea !== undefined && { knowledgeArea: data.knowledgeArea }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
        ...(data.status !== undefined && { status: data.status }),
      }
    })
  }

  async delete(id: string) {
    return this.prisma.project.delete({
      where: { id },
    })
  }
}

import { prisma } from '../prisma/prisma'
export const projectRepository = new ProjectRepository(prisma)