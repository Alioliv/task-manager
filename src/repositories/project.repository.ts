import type { PrismaClient } from '../prisma/generated/prisma/client'
import { prisma } from '../prisma/prisma'
import type { CreateProjectDto,UpdateProjectDto } from '../common/dtos/project.dto'

export class ProjectRepository {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma
  }

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

  async create(data: CreateProjectDto) {
    const createData = {
      title: data.title,
      description: data.description ?? null,
      knowledgeArea: data.knowledgeArea,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: data.status ?? 'PLANEJAMENTO',
      ownerId: data.ownerId,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.project.create({ data: createData as any })
  }

  async update(id: string, data: UpdateProjectDto) {
    const updateData = {
      title: data.title,
      description: data.description ?? null,
      knowledgeArea: data.knowledgeArea,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: data.status,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.project.update({ where: { id }, data: updateData as any })
  }

  async delete(id: string) {
    return this.prisma.project.delete({
      where: { id },
    })
  }
}

export const projectRepository = new ProjectRepository(prisma)