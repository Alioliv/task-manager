import { Router } from "express"
import { userController } from "../controllers/user.controller"
import { authenticate, authorize } from "../middlewares/auth.middleware"

export const userRouter = Router()

//public
userRouter.post("/register", async (req, res) => {
  return userController.register(req, res)
})

userRouter.post("/login", async (req, res) => {
  return userController.login(req, res)
})

// autenticado
userRouter.get("/me", authenticate, async (req, res) => {
  return userController.getMe(req, res)
})

userRouter.put("/me", authenticate, async (req, res) => {
  return userController.updateProfile(req, res)
})

userRouter.put("/me/password", authenticate, async (req, res) => {
  return userController.updatePassword(req, res)
})

// Admin
userRouter.get("/", authenticate, authorize("ADMIN"), async (req, res) => {
  return userController.listAll(req, res)
})

userRouter.delete("/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  return userController.deleteUser(req, res)
})