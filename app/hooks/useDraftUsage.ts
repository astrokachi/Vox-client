import { useCallback, useEffect, useState } from "react";
import { chatApi } from "~/api/endpoints";
import { getSocket } from "~/services/socket";
import type { DraftUsage } from "~/types";

// Socket events after which the server's count may have changed: drafts
// arriving can refund a shortfall, and a failed job refunds its reservation.
// The server settles the count before emitting any of them.
const USAGE_EVENTS = ["message:received", "message:refined", "message:error"];

// The free-tier draft allowance, kept current as drafts are generated.
// `null` until the first load (or if it fails), so callers show no count.
export const useDraftUsage = () => {
  const [usage, setUsage] = useState<DraftUsage | null>(null);

  const refresh = useCallback(async () => {
    try {
      setUsage(await chatApi.usage());
    } catch (err) {
      console.error("Failed to load draft usage:", err);
    }
  }, []);

  useEffect(() => {
    refresh();

    const socket = getSocket();
    if (!socket) return;

    // A turn's drafts arrive one event each; refetch once per turn.
    let lastTurnId: string | null = null;
    const onTurnEvent = ({ messageGroupId }: { messageGroupId: string }) => {
      if (messageGroupId === lastTurnId) return;
      lastTurnId = messageGroupId;
      refresh();
    };

    USAGE_EVENTS.forEach((event) => socket.on(event, onTurnEvent));
    return () => {
      USAGE_EVENTS.forEach((event) => socket.off(event, onTurnEvent));
    };
  }, [refresh]);

  const exhausted = usage !== null && usage.remaining === 0;

  return { usage, exhausted, refresh };
};
