import { Router } from "express"
import { tasksController } from "../controllers/tasks.controller"
import { authenticate, authorize } from "../middlewares/auth.middleware"

const router = Router({ mergeParams: true })

router.post("/", authenticate, tasksController.create)
router.get("/", authenticate, tasksController.findMany)
router.post("/:id/assignees", authenticate, tasksController.addAssignees)
router.get("/:id/history", authenticate, authorize("ADMIN", "MEMBER"), tasksController.getHistory)

export default router