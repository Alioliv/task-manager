import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../common/errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    res.status(422).json({
      error: "Validation error",
      details: err.flatten(),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
