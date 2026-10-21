import { useEffect, useRef } from "react";

// Generous on purpose: the backend retries a job 3 times with backoff before
// it reports an error.
export const PENDING_TIMEOUT_MS = 120_000;

// Calls `onTimeout` once `active` has stayed true for PENDING_TIMEOUT_MS with no
// new socket activity. Covers jobs whose error event never arrives (the job was
// picked up elsewhere, or the server restarted mid-job).
export const usePendingTimeout = (
  active: boolean,
  lastActivity: number,
  onTimeout: () => void,
) => {
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => onTimeoutRef.current(), PENDING_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [active, lastActivity]);
};
