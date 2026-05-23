import type { NextFunction, Request, Response } from "express"
import { UserService, userService } from "../services/user.service"
import type { UpdatePasswordDto, UpdateProfileDto } from "../common/dtos/user.dto"

class UserController {
  constructor(private readonly service: UserService) {}

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user!.id
      const dataUser = await this.service.getMe(idUser)
      return res.status(200).json({
        message: "Usuário encontrado!",
        data: dataUser
      })
    } catch (error) { next(error) }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user!.id
      const dataToUpdate = req.body as UpdateProfileDto
      const updatedUser = await this.service.updateProfile(idUser, dataToUpdate)
      return res.status(200).json({
        message: 'Usuário atualizado!',
        data: updatedUser
      });
    } catch (error) { next(error) }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user!.id
      const passwordToUpdate = req.body as UpdatePasswordDto
      await this.service.updatePassword(idUser, passwordToUpdate)
      return res.status(204).send()
    } catch (error) { next(error) }
  }

  async listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.service.listAll();
      return res.status(200).json({
        message: 'Usuários encontrados',
        data: users
      })
    } catch (error) { next(error) }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = Number(req.params.id)
      const userDeleted = await this.service.deleteUser(idUser)
      return res.status(200).json({
        message: "Usuário deletado com sucesso",
      })
    } catch (error) { next(error) }
  }

  async promoteToAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      await this.service.promoteToAdmin(id)
      return res.status(200).json({ message: "Usuário promovido a admin" })
    } catch (error) { next(error) }
  }
}

export const userController = new UserController(userService)
