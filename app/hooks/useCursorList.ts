import { useCallback, useEffect, useRef, useState } from "react";
import { apiCache } from "~/lib/api-cache";
import { handleUserError } from "~/lib/errorHandler";
import type { Page } from "~/types";

export interface CursorList<T> {
  items: T[];
  // First page only: true until something can be shown.
  loading: boolean;
  // First page failed and there is nothing cached to show.
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadMoreError: string | null;
  loadMore: () => void;
  retry: () => void;
}

// A cursor-paginated list: the first page (shown from cache instantly, then
// refreshed), and older pages appended on demand. `fetchPage` must be stable
// (defined at module level or memoized).
export const useCursorList = <T>(
  fetchPage: (cursor?: string) => Promise<Page<T>>,
  cacheKey: string,
): CursorList<T> => {
  const firstPageKey = apiCache.generateKey(cacheKey, "first-page");

  const [page, setPage] = useState<Page<T> | null>(() => apiCache.get<Page<T>>(firstPageKey));
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  // Ignores responses that land after a newer load started or after unmount.
  const generation = useRef(0);

  // Settles state only after the request resolves, so the mount effect never
  // sets state synchronously.
  const fetchFirst = useCallback(
    async (run: number) => {
      try {
        const first = await fetchPage();
        if (run !== generation.current) return;
        setPage(first);
        setError(null);
        setLoadMoreError(null);
        apiCache.set(firstPageKey, first);
      } catch (err) {
        if (run !== generation.current) return;
        console.error(`Failed to load ${cacheKey}:`, err);
        setError(handleUserError(err).message);
      }
    },
    [fetchPage, firstPageKey, cacheKey],
  );

  useEffect(() => {
    const counter = generation;
    fetchFirst(++counter.current);
    return () => {
      counter.current++;
    };
  }, [fetchFirst]);

  const retry = useCallback(() => {
    setError(null);
    // Any older-page request in flight is now stale.
    setLoadingMore(false);
    fetchFirst(++generation.current);
  }, [fetchFirst]);

  const loadMore = useCallback(async () => {
    if (!page?.nextCursor || loadingMore) return;
    const run = generation.current;
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const next = await fetchPage(page.nextCursor);
      if (run !== generation.current) return;
      setPage((prev) => ({
        items: [...(prev?.items ?? []), ...next.items],
        nextCursor: next.nextCursor,
      }));
    } catch (err) {
      if (run !== generation.current) return;
      console.error(`Failed to load more ${cacheKey}:`, err);
      setLoadMoreError(handleUserError(err).message);
    } finally {
      if (run === generation.current) setLoadingMore(false);
    }
  }, [page, loadingMore, fetchPage, cacheKey]);

  return {
    items: page?.items ?? [],
    loading: page === null && error === null,
    // A cached page stays on screen if the refresh fails.
    error: page === null ? error : null,
    hasMore: !!page?.nextCursor,
    loadingMore,
    loadMoreError,
    loadMore,
    retry,
  };
};
