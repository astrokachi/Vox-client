import { useCallback, useState } from "react";
import { useApiError, type ErrorState } from "./useApiError";
import { apiCache } from "~/lib/api-cache";

interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: ErrorState | null;
}

interface UseApiCallOptions {
  cacheKey?: string;
  cacheTtl?: number;
}

interface useApiCallReturn<TDto, TResult> extends ApiCallState<TResult> {
  execute: (dto: TDto) => Promise<TResult | null>;
  reset: () => void;
  prefetch: (dto: TDto) => void;
}

export function useApiCall<TDto, TResult>(
  apiFn: (dto: TDto) => Promise<TResult>,
  options?: UseApiCallOptions,
): useApiCallReturn<TDto, TResult> {
  const [data, setData] = useState<TResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, clearError, handleError } = useApiError();

  const getCacheKey = useCallback(
    (dto: TDto) => {
      if (!options?.cacheKey) return null;
      return apiCache.generateKey(options.cacheKey, dto);
    },
    [options?.cacheKey],
  );

  const execute = useCallback(
    async (dto: TDto): Promise<TResult | null> => {
      const cacheKey = getCacheKey(dto);

      if (cacheKey) {
        const cached = apiCache.get<TResult>(cacheKey);
        if (cached !== null) {
          setData(cached);
          try {
            const res = await apiFn(dto);
            setData(res);
            apiCache.set(cacheKey, res, options?.cacheTtl);
          } catch {
            // Stale cache is fine
          }
          return null;
        }
      }

      setLoading(true);
      clearError();

      try {
        const res = await apiFn(dto);
        setData(res);
        if (cacheKey) apiCache.set(cacheKey, res, options?.cacheTtl);
        return null;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFn, clearError, handleError, getCacheKey, options?.cacheTtl],
  );

  const prefetch = useCallback(
    async (dto: TDto) => {
      const cacheKey = getCacheKey(dto);
      if (!cacheKey) return;

      if (apiCache.get<TResult>(cacheKey) !== null) return;

      try {
        const res = await apiFn(dto);
        apiCache.set(cacheKey, res, options?.cacheTtl);
      } catch {
        // Silent
      }
    },
    [apiFn, getCacheKey, options?.cacheTtl],
  );

  const reset = useCallback(() => {
    setData(null);
    clearError();
  }, [clearError]);

  return { data, loading, error, execute, reset, prefetch };
}
