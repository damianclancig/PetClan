/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
