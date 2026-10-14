class ApplicationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number, errorType: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = errorType;
  }
}

export type AttemptError = {
  message: string;
  retryable: boolean;
  provider?: string;
  code?: string;
};

class ForbiddenError extends ApplicationError {
  constructor(message: string) {
    super(message, 403, "ForbiddenError");
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400, "ValidationError");
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message: string) {
    super(message, 401, "UnauthorizedError");
  }
}

class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 404, "NotFoundError");
  }
}

export default {
  ApplicationError,
  ForbiddenError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
};