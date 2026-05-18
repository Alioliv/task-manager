import { Router } from "express";
import { authController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
    return authController.cadastrar(req, res)
})

