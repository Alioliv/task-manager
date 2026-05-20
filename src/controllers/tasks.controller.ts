import type { Request, Response } from "express"
import { HistoryService } from "../services/history.service"
import { tasksRepository } from "../repositories/tasks.repository"

export const tasksController = {
  async create(req: Request, res: Response) {
    try {
      const { title, description, dueDate, priority } = req.body
      const task = await HistoryService.create({
        title,
        description,
        ...(dueDate && { dueDate: new Date(dueDate) }),
        priority
      })
      return res.status(201).json(task)
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar tarefa" })
    }
  },

  async getHistory(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const task = await tasksRepository.findById(id)
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" })
      }
      const history = await HistoryService.findByTaskId(id)
      return res.status(200).json(history)
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar histórico" })
    }
  }
}