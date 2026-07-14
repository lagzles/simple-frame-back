export type ErrorDetails = Record<string, unknown> | unknown[] | null;

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: ErrorDetails = null,
  ) {
    super(message);
  }
}

export function badRequest(code: string, message: string, details: ErrorDetails = null): ApiError {
  return new ApiError(400, code, message, details);
}

export function unauthorized(message = "Autenticacao obrigatoria."): ApiError {
  return new ApiError(401, "UNAUTHORIZED", message);
}

export function forbidden(message = "Acesso negado."): ApiError {
  return new ApiError(403, "FORBIDDEN", message);
}

export function notFound(message = "Recurso nao encontrado."): ApiError {
  return new ApiError(404, "NOT_FOUND", message);
}

export function conflict(code: string, message: string, details: ErrorDetails = null): ApiError {
  return new ApiError(409, code, message, details);
}
