import { useState } from "react";
import { chatApi } from "~/api/endpoints";
import { useConversationMessages } from "~/hooks/useConversationMessages";
import { useConversationSocket } from "~/hooks/useConversationSocket";
import { PENDING_TIMEOUT_MS, usePendingTimeout } from "~/hooks/usePendingTimeout";
import type { Turn } from "~/types";

const EMPTY_IDS: ReadonlySet<string> = new Set();

const without = (ids: ReadonlySet<string>, id: string) => {
  if (!ids.has(id)) return ids;
  const next = new Set(ids);
  next.delete(id);
  return next;
};

// A turn from history that has no drafts yet is only still being written if
// its prompt is recent; older ones failed before this page loaded.
const isRecentlyAsked = (turn: Turn) =>
  Date.now() - Date.parse(turn.question?.created_at ?? "") < PENDING_TIMEOUT_MS;

// Every prompt in a post with its drafts, kept live as new drafts stream in.
// A turn with no drafts is either still being written (in `pendingTurnIds`)
// or failed.
export const useDrafts = (conversationId: string) => {
  const { turns: history, loading, error: loadError } =
    useConversationMessages(conversationId);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pendingTurnIds, setPendingTurnIds] = useState<ReadonlySet<string>>(EMPTY_IDS);
  const [error, setError] = useState<string | null>(null);

  // Reset to the server's history whenever a fresh copy arrives.
  const [syncedHistory, setSyncedHistory] = useState(history);
  if (history !== syncedHistory) {
    setSyncedHistory(history);
    if (history) {
      setTurns(history);
      const latest = history[history.length - 1];
      if (latest && latest.response.options.length === 0 && isRecentlyAsked(latest)) {
        setPendingTurnIds((prev) => new Set(prev).add(latest.turnId));
      }
    }
  }

  const { isTyping, lastActivity } = useConversationSocket({
    conversationId,
    onMessageReceived: ({ messageGroupId, message }) => {
      setPendingTurnIds((prev) => without(prev, messageGroupId));
      // Append the streamed draft into its turn.
      setTurns((prev) =>
        prev.map((t) => {
          if (t.turnId !== messageGroupId) return t;
          if (t.response.options.some((o) => o.id === message.id)) return t;
          return {
            ...t,
            response: {
              ...t.response,
              options: [...t.response.options, message],
            },
          };
        }),
      );
    },
    onError: ({ messageGroupId }) => {
      setPendingTurnIds((prev) => without(prev, messageGroupId));
    },
  });

  // No result and no error in time: treat everything still pending as failed.
  usePendingTimeout(pendingTurnIds.size > 0, lastActivity, () =>
    setPendingTurnIds(EMPTY_IDS),
  );

  // Asks for three more drafts from a new prompt.
  const sendPrompt = async (content: string) => {
    setError(null);
    try {
      const turn = await chatApi.addMessage({
        conversationId,
        payload: { content, type: "MULTIPLE" },
      });
      if (turn.response.options.length === 0) {
        setPendingTurnIds((prev) => new Set(prev).add(turn.turnId));
      }
      setTurns((prev) =>
        prev.some((t) => t.turnId === turn.turnId) ? prev : [...prev, turn],
      );
    } catch (err) {
      console.error("Failed to send prompt:", err);
      setError("Couldn't send that prompt. Try again.");
    }
  };

  // Re-asks a failed turn's prompt. This uses another prompt.
  const retry = (turn: Turn) => {
    if (turn.question) sendPrompt(turn.question.content);
  };

  return {
    turns,
    pendingTurnIds,
    isTyping,
    loading: loading && turns.length === 0,
    error: error ?? loadError?.message ?? null,
    sendPrompt,
    retry,
  };
};
