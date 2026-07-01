export interface AppErrorOptions {
  code: string;
  message: string;
  isOperational?: boolean;
  metadata?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly metadata?: Record<string, unknown>;

  constructor({ code, message, isOperational = true, metadata }: AppErrorOptions) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.code = code;
    this.isOperational = isOperational;
    this.metadata = metadata;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super({
      code: 'VALIDATION_ERROR',
      message,
      isOperational: true,
      metadata,
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Autenticación fallida', metadata?: Record<string, unknown>) {
    super({
      code: 'AUTH_FAILED',
      message,
      isOperational: true,
      metadata,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado', metadata?: Record<string, unknown>) {
    super({
      code: 'NOT_FOUND',
      message,
      isOperational: true,
      metadata,
    });
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor', metadata?: Record<string, unknown>) {
    super({
      code: 'INTERNAL_ERROR',
      message,
      isOperational: false,
      metadata,
    });
  }
}
