import type { NextFunction, Request, Response } from 'express'
import { ProjectService, projectService } from '../services/project.service'
import { CreateProjectDto, UpdateProjectDto } from '../common/dtos/project.dto'

const getParam = (param: string | string[] | undefined): string =>
  Array.isArray(param) ? param[0] ?? '' : param ?? ''

class ProjectController {
  constructor(private readonly service: ProjectService) {}

  async listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await this.service.listAll()
      return res.status(200).json({
        message: 'Projetos encontrados',
        data: projects,
      })
    } catch (error) { next(error) }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params['id'])
      const project = await this.service.getById(id)
      return res.status(200).json({
        message: 'Projeto encontrado',
        data: project,
      })
    } catch (error) { next(error) }
  }

  async getByOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = Number(getParam(req.params['ownerId']))
      const projects = await this.service.getByOwner(ownerId)
      return res.status(200).json({
        message: 'Projetos do usuário encontrados',
        data: projects,
      })
    } catch (error) { next(error) }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateProjectDto.parse(req.body)
      const project = await this.service.create(data)
      return res.status(201).json({
        message: 'Projeto criado com sucesso',
        data: project,
      })
    } catch (error) { next(error) }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params['id'])
      const data = UpdateProjectDto.parse(req.body)
      const project = await this.service.update(id, data)
      return res.status(200).json({
        message: 'Projeto atualizado com sucesso',
        data: project,
      })
    } catch (error) { next(error) }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req.params['id'])
      await this.service.delete(id)
      return res.status(204).send()
    } catch (error) { next(error) }
  }
}

export const projectController = new ProjectController(projectService)