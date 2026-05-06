export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN';

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isRetryable: boolean;

  constructor({
    message,
    code,
    statusCode,
    details,
    isRetryable = false,
  }: {
    message: string;
    code: ApiErrorCode;
    statusCode: number;
    details?: unknown;
    isRetryable?: boolean;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isRetryable = isRetryable;
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
