import type { Request, Response } from "express"
import { HistoryService } from "../services/history.service"
import { tasksService } from "../services/tasks.service"
import { tasksRepository } from "../repositories/tasks.repository"

export const tasksController = {
  async create(req: Request, res: Response) {
    try {
      const { title, description, dueDate, priority, projectId } = req.body
      const createdById = req.user!.id

      const task = await tasksService.create({
        title,
        description,
        ...(dueDate && { dueDate: new Date(dueDate) }),
        priority,
        createdById,
        ...(projectId && { projectId })
      })

      return res.status(201).json(task)
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar tarefa" })
    }
  },

  async addAssignees(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const { userIds } = req.body
      const userId = req.user!.id

      const task = await tasksService.addAssignees(id, userIds, userId)
      return res.status(200).json(task)
    } catch (error: any) {
      const isNotFound = error.message?.includes("não encontrada") || error.message?.includes("não encontrados")
      return res.status(isNotFound ? 404 : 500).json({ message: error.message ?? "Erro ao atribuir usuários" })
    }
  },

  async findMany(req: Request, res: Response) {
    try {
      const { projectId } = req.params as { projectId: string }
      const userId = req.user!.id
      const isAdmin = req.user!.role.includes("ADMIN")
      const page = Number(req.query["page"]) || 1
      const limit = Number(req.query["limit"]) || 10

      const result = await tasksService.findMany({
        projectId,
        userId,
        isAdmin,
        page,
        limit
      })

      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Erro ao listar tarefas" })
    }
  },

  async getHistory(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }

      const task = await tasksRepository.findById(id)
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" })
      }

      const requesterId = req.user!.id
      const isAdmin = req.user!.role.includes("ADMIN")

      const history = await HistoryService.findByTaskId({
        taskId: id,
        requesterId,
        isAdmin
      })

      return res.status(200).json(history)
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar histórico" })
    }
  }
}