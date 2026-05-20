import { NotFoundError } from '../common/errors'
import { ProjectRepository, projectRepository } from '../repositories/project.repository'
import type { CreateProjectDto,UpdateProjectDto } from '../common/dtos/project.dto'

export class ProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async listAll() {
    return this.repository.findAll()
  }

  async getById(id: string) {
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

  async update(id: string, data: UpdateProjectDto) {
    await this.getById(id)
    return this.repository.update(id, data)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.repository.delete(id)
  }
}

export const projectService = new ProjectService(projectRepository)