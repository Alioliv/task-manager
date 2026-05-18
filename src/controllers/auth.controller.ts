import type { NextFunction, Request, Response } from "express";
import type { User } from "../prisma/generated/prisma/client";
import { AuthService, authService } from "../services/auth.service";

class AuthController {
  constructor(private readonly service: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dataUser = req.body as User;
      const userCreated = await this.service.register(dataUser);
      
      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        data: userCreated,
      });
    } catch (error) { next(error) }
  }

  async registerAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.registerAdmin(req.body as User);
      
      return res.status(201).json({
        message: "Admin criado com sucesso!",
        data: user,
      });
    } catch (error) { next(error) }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { tokenAccess, tokenRefresh } = await this.service.login(req.body as Partial<User>)
      
      return res.status(200).json({
        message: "Usuário autenticado com sucesso!",
        accessToken: tokenAccess,
        refreshToken: tokenRefresh,
      });
    } catch (error) { next(error) }
  }
}

export const authController = new AuthController(authService);
