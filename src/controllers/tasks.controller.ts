import type { Request, Response } from "express"
import { HistoryService } from "../services/history.service"
import { tasksService } from "../services/tasks.service"
import { tasksRepository } from "../repositories/tasks.repository"
import { Priority, Status } from "../prisma/generated/prisma/client"

export const tasksController = {
  async create(req: Request, res: Response) {
    try {
      const { title, description, dueDate, priority } = req.body
      const projectId = Number(req.params.projectId)
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
      const userId = req.user!.id
      const isAdmin = req.user!.role.includes("ADMIN")
      const page = Number(req.query["page"]) || 1
      const limit = Number(req.query["limit"]) || 10
      const status = (req.query["status"] as Status | undefined) || undefined
      const priority = (req.query["priority"] as Priority | undefined) || undefined
      const dueDateFrom = req.query["dueDateFrom"] ? new Date(req.query["dueDateFrom"] as string) : undefined
      const dueDateTo = req.query["dueDateTo"] ? new Date(req.query["dueDateTo"] as string) : undefined

      if (dueDateFrom && dueDateTo && dueDateFrom > dueDateTo) {
        return res.status(400).json({ message: "dueDateFrom não pode ser posterior a dueDateTo" })
      }

      const result = await tasksService.findMany({
        projectId,
        userId,
        isAdmin,
        page,
        limit,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDateFrom && { dueDateFrom }),
        ...(dueDateTo && { dueDateTo })
      })
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Erro ao listar tarefas" })
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
      if (error.message === "Tarefa não encontrada") return res.status(404).json({ message: error.message })
      if (error.message === "Sem permissão para editar esta tarefa") return res.status(403).json({ message: error.message })
      if (error.message === "Tarefa já está concluída") return res.status(400).json({ message: error.message })
      if (error.message === "Apenas tarefas concluídas podem ser reabertas") return res.status(400).json({ message: error.message })
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
      if (error.message === "Tarefa não encontrada") return res.status(404).json({ message: error.message })
      if (error.message === "Sem permissão para concluir esta tarefa") return res.status(403).json({ message: error.message })
      if (error.message === "Tarefa já está concluída") return res.status(400).json({ message: error.message })
      return res.status(500).json({ message: "Erro ao concluir tarefa" })
    }
  },

  async reopen(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const userId = req.user!.id
      const isAdmin = req.user!.role.includes("ADMIN")
      const task = await tasksService.reopen(id, userId, isAdmin)
      return res.status(200).json(task)
    } catch (error: any) {
      const isNotFound = error.message?.includes("não encontrada")
      const isForbidden = error.message?.includes("permissão") || error.message?.includes("Apenas")
      return res.status(isNotFound ? 404 : isForbidden ? 403 : 500).json({ message: error.message ?? "Erro ao reabrir tarefa" })
    }
  },

  async getHistory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const requesterId = req.user!.id
      const isAdmin = req.user!.role.includes("ADMIN")
      const history = await HistoryService.findByTaskId({ taskId: id, requesterId, isAdmin })
      return res.status(200).json(history)
    } catch (error: any) {
      const isNotFound = error.message?.includes("não encontrada")
      return res.status(isNotFound ? 404 : 500).json({ message: error.message ?? "Erro ao buscar histórico" })
    }
  }
}