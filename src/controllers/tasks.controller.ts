import type { Request, Response } from "express"
import { HistoryService } from "../services/history.service"
import { tasksService } from "../services/tasks.service"
import { tasksRepository } from "../repositories/tasks.repository"
import { Status } from "../prisma/generated/prisma/client"

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
        ...(projectId && { projectId: Number(projectId) })
      })

      return res.status(201).json(task)
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar tarefa" })
    }
  },

  async addAssignees(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
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
      const projectId = Number(req.params.projectId)

      console.log("projectId:", projectId, "userId:", req.user!.id, "isAdmin:", req.user!.role.includes("ADMIN"))

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
      const id = Number(req.params.id)
      const task = await tasksRepository.findById(id)
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" })
      }
      const history = await HistoryService.findByTaskId(id)
      return res.status(200).json(history)
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar histórico" })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const userId = req.user!.id
      const isAdmin = req.user!.role.includes("ADMIN")
      const { title, description, dueDate, status } = req.body

      if (status && !Object.values(Status).includes(status)) {
        return res.status(400).json({ message: "Status inválido" })
      }

      const task = await tasksService.update(
        id,
        {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
          ...(status !== undefined && { status })
        },
        userId,
        isAdmin
      )

      return res.status(200).json(task)
    } catch (error: any) {
      if (error.message === "Tarefa não encontrada") {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === "Sem permissão para editar esta tarefa") {
        return res.status(403).json({ message: error.message })
      }
      return res.status(500).json({ message: "Erro ao editar tarefa" })
    }
  },

  async complete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const userId = req.user!.id
      const isAdmin = req.user!.role.includes("ADMIN")

      const task = await tasksService.complete(id, userId, isAdmin)
      return res.status(200).json(task)
    } catch (error: any) {
      if (error.message === "Tarefa não encontrada") {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === "Sem permissão para concluir esta tarefa") {
        return res.status(403).json({ message: error.message })
      }
      if (error.message === "Tarefa já está concluída") {
        return res.status(400).json({ message: error.message })
      }
      return res.status(500).json({ message: "Erro ao concluir tarefa" })
    }
  }
}