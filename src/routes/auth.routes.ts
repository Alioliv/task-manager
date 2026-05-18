import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authorize, authenticate } from "../middlewares/auth.middleware";
import { RoleType } from "../prisma/generated/prisma";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
    return authController.register(req, res, next)
})

authRouter.post("/login", async (req, res, next) => {
    return authController.login(req, res, next)
})

authRouter.post("/register/admin", authenticate, authorize(RoleType.ADMIN), async (req, res, next) => {
    return authController.registerAdmin(req, res, next)
})