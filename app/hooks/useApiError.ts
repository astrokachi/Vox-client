// create an error state that returns error messages to the user
//
import { useCallback, useState } from "react";
import { type ApiErrorCode } from "~/api/error";
import { handleUserError } from "~/lib/errorHandler";

export interface ErrorState {
  message: string;
  code: ApiErrorCode;
}

export const useApiError = () => {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((err: unknown) => {
    const userError = handleUserError(err);
    setError(userError);
  }, [])

  const clearError = () => {
    setError(null);
  }

  return { error, handleError, clearError };
}
