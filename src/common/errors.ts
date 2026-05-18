export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) { super(message, 409) }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) { super(message, 401) }
}

export class NotFoundError extends AppError {
  constructor(message: string) { super(message, 404) }
}

export class ForbiddenError extends AppError {
  constructor(message: string) { super(message, 403) }
}