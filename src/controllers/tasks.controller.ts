import type { Request, Response } from "express"
import { HistoryService } from "../services/history.service"

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
  }
}