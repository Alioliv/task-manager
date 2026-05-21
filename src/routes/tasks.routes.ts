import { Router } from "express"
import { tasksController } from "../controllers/tasks.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router({ mergeParams: true })

router.post("/", authenticate, tasksController.create)
router.post("/:id/assignees", authenticate, tasksController.addAssignees)
router.get("/", authenticate, tasksController.findMany)
router.get("/:id/history", authenticate, tasksController.getHistory)
router.patch("/:id", authenticate, tasksController.update)
router.patch("/:id/complete", authenticate, tasksController.complete)

export default router