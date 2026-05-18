import express from "express"
import tasksRouter from "./routes/tasks.routes"
import { userRouter } from "./routes/user.routes"
import { errorHandler } from "./middlewares/error.middleware"

const app = express()

app.use(express.json())

// === USERS ===
app.use("/users", userRouter)

// === TAREFAS ===
app.use("/projects/:projectId/tasks", tasksRouter)

app.use(errorHandler)

export default app