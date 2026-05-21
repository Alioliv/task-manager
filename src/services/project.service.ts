import { NotFoundError, ForbiddenError } from '../common/errors'
import { ProjectRepository, projectRepository } from '../repositories/project.repository'
import type { CreateProjectDto, UpdateProjectDto } from '../common/dtos/project.dto'

export class ProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async listAll() {
    return this.repository.findAll()
  }

  async getById(id: number) {
    const project = await this.repository.findById(id)

    if (!project) {
      throw new NotFoundError('Projeto não encontrado')
    }

    return project
  }

  async getByOwner(ownerId: number) {
    return this.repository.findByOwnerId(ownerId)
  }

  async create(data: CreateProjectDto) {
    return this.repository.create(data)
  }

  async update(id: number, data: UpdateProjectDto, requesterId: number, isAdmin: boolean) {
    const project = await this.getById(id)

    if (!isAdmin && project.ownerId !== requesterId) {
      throw new ForbiddenError('Você não tem permissão para editar este projeto')
    }

    return this.repository.update(id, data)
  }

  async delete(id: number, requesterId: number, isAdmin: boolean) {
    const project = await this.getById(id)

    if (!isAdmin && project.ownerId !== requesterId) {
      throw new ForbiddenError('Você não tem permissão para deletar este projeto')
    }

    return this.repository.delete(id)
  }
}

export const projectService = new ProjectService(projectRepository)