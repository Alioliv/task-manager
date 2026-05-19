import { Router } from "express"
import { userController } from "../controllers/user.controller"
import { authenticate, authorize } from "../middlewares/auth.middleware"
import { RoleType } from "../prisma/generated/prisma"

export const userRouter = Router()

// autenticado
userRouter.get("/me", authenticate, async (req, res, next) => {
  return userController.getMe(req, res, next)
})

userRouter.put("/me", authenticate, async (req, res, next) => {
  return userController.updateProfile(req, res, next)
})

userRouter.put("/me/password", authenticate, async (req, res, next) => {
  return userController.updatePassword(req, res, next)
})

// Admin
userRouter.get("/", authenticate, authorize(RoleType.ADMIN), async (req, res, next) => {
  return userController.listAll(req, res, next)
})

userRouter.delete("/:id", authenticate, authorize(RoleType.ADMIN), async (req, res, next) => {
  return userController.deleteUser(req, res, next)
})