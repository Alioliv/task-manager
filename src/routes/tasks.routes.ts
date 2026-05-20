import { Router } from "express"
import { tasksController } from "../controllers/tasks.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router({ mergeParams: true })

router.post("/", authenticate, tasksController.create)

export default router