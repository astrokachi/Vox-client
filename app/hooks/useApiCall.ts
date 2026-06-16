import { useCallback, useState } from "react";
import { useApiError, type ErrorState } from "./useApiError";


interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: ErrorState | null;
}

interface useApiCallReturn<TDto, TResult> extends ApiCallState<TResult> {
  execute: (dto: TDto) => Promise<TResult | null>;
  reset: () => void;
}

export function useApiCall<TDto, TResult>(
  apiFn: (dto: TDto) => Promise<TResult>
): useApiCallReturn<TDto, TResult> {
  const [data, setData] = useState<TResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, clearError, handleError } = useApiError();

  const execute = useCallback(
    async (dto: TDto): Promise<TResult | null> => {
      setLoading(true);
      clearError();

      try {
        const res = await apiFn(dto);
        setData(res);
        return null;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false)
      }
    }, [apiFn, clearError, handleError])


  const reset = useCallback(() => {
    setData(null);
    clearError();
  }, [clearError])

  return { data, loading, error, execute, reset };
}
