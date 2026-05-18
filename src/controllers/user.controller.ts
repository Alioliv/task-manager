import type { Request, Response } from "express"
import { UserService, userService } from "../services/user.service"

class UserController {
  constructor(private readonly service: UserService) {
    this.service = userService
  }

  async register(req: Request, res: Response) {
    const user = await this.service.register(req.body)
    res.status(201).json(user)
  }

  async login(req: Request, res: Response) {
    const result = await this.service.login(req.body)
    res.json(result)
  }

  async getMe(req: Request, res: Response) {
    const user = await this.service.getMe(req.user!.sub)
    res.json(user)
  }

  async updateProfile(req: Request, res: Response) {
    const user = await this.service.updateProfile(req.user!.sub, req.body)
    res.json(user)
  }

  async updatePassword(req: Request, res: Response) {
    await this.service.updatePassword(req.user!.sub, req.body)
    res.status(204).send()
  }

  async listAll(_req: Request, res: Response) {
    const users = await this.service.listAll()
    res.json(users)
  }

  async deleteUser(req: Request, res: Response) {
    await this.service.deleteUser(Number(req.params["id"]))
    res.status(204).send()
  }
}

export const userController = new UserController(userService)