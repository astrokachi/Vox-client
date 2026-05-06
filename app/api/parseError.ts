import axios from "axios";
import { type ApiErrorCode, ApiError } from "./error";

function getCodeFromStatus(statusCode: number): ApiErrorCode {
  switch (statusCode) {
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 409: return 'CONFLICT';
    case 422: return 'VALIDATION_ERROR';
    case 429: return 'RATE_LIMITED';
    default: return statusCode >= 500 ? 'SERVER_ERROR' : 'UNKNOWN';
  }
}

//
// function isRetryable(status: number): boolean {
//   return [429, 503, 504].includes(status);
// }

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    // network failure or timeout
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED';
      return new ApiError({
        message: isTimeout ? 'Request timed out.' : 'Network error. Please check your connection.',
        code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        statusCode: 0,
        isRetryable: true,
      });
    }

    const { status, data } = error.response;

    const serverMessage = (typeof data == 'object' && data != null && 'message' in data)
      ? String((data as Record<string, unknown>).message)
      : undefined;

    return new ApiError({
      message: serverMessage ?? error.message,
      code: getCodeFromStatus(status),
      statusCode: status,
      details: data,
    })
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      code: "UNKNOWN",
      statusCode: 0,
    })
  }

  return new ApiError({
    message: "An error occured",
    code: "UNKNOWN",
    statusCode: 0,
  })
}
