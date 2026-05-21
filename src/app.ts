import express from "express"
import tasksRouter from "./routes/tasks.routes"
import { userRouter } from "./routes/user.routes"
import { errorHandler } from "./middlewares/error.middleware"
import { projectRouter } from './routes/project.routes'
import { authRouter } from "./routes/auth.routes"

const app = express()

app.use(express.json())

app.use("/auth", authRouter)

// === USERS ===
app.use("/users", userRouter)

// === TAREFAS ===
app.use("/projects/:projectId/tasks", tasksRouter)

// === PROJETOS ===
app.use('/projects', projectRouter)

app.use(errorHandler)

export default app