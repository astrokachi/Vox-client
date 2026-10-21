import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { chatApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import { useConversationMessages } from "~/hooks/useConversationMessages";
import { useConversationSocket } from "~/hooks/useConversationSocket";
import { usePendingTimeout } from "~/hooks/usePendingTimeout";
import type { ChatGetThreadDto, Turn } from "~/types";

// One version of a draft being refined. The first is the original draft.
export interface RefineVersion {
  id: string;
  // The instruction that produced this version; null for the original.
  instruction: string | null;
  // Null while the AI is still writing it (or the original is loading).
  content: string | null;
}

const PENDING_PREFIX = "pending-";

const toVersion = (turn: Turn): RefineVersion => ({
  id: turn.response.options[0]?.id ?? turn.turnId,
  instruction: turn.question?.content ?? null,
  content: turn.response.options[0]?.content ?? null,
});

// The original draft and every refinement of it, oldest first.
// `fallbackDraft` is the draft text handed over by navigation, used only
// until the original loads from the server.
export const useRefineHistory = (
  conversationId: string,
  messageId: string,
  fallbackDraft?: string,
) => {
  const [refinements, setRefinements] = useState<RefineVersion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { turns, loading: loadingOriginal } = useConversationMessages(conversationId);

  const {
    execute: loadThread,
    prefetch: prefetchThread,
    data: thread,
    error: threadError,
  } = useApiCall<ChatGetThreadDto, Turn[]>(chatApi.getThread, {
    cacheKey: "message-thread",
  });

  const threadDto = { responseId: messageId } satisfies ChatGetThreadDto;

  useEffect(() => {
    if (!messageId) return;
    loadThread(threadDto);
  }, [messageId]);

  const { pathname } = useLocation();
  useEffect(() => {
    if (!messageId) return;
    prefetchThread(threadDto);
  }, [pathname]);

  // Reset to the server's thread whenever a fresh copy arrives.
  const [syncedThread, setSyncedThread] = useState(thread);
  if (thread !== syncedThread) {
    setSyncedThread(thread);
    // A refinement with no result failed before this page loaded; skip it.
    if (thread) setRefinements(thread.filter((t) => t.response.options.length > 0).map(toVersion));
  }

  const original = useMemo<RefineVersion | null>(() => {
    const fromServer = turns
      ?.flatMap((t) => t.response.options)
      .find((m) => m.id === messageId)?.content;
    const content = fromServer ?? fallbackDraft ?? null;
    // Loaded and still not found: nothing to show for the original.
    if (content === null && !loadingOriginal) return null;
    return { id: messageId, instruction: null, content };
  }, [turns, messageId, fallbackDraft, loadingOriginal]);

  const { lastActivity } = useConversationSocket({
    conversationId,
    onMessageRefined: ({ message }) => {
      setRefinements((prev) => {
        // Fill the most recent pending version; otherwise append.
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].content === null) {
            const copy = [...prev];
            copy[i] = { ...copy[i], id: message.id, content: message.content };
            return copy;
          }
        }
        return [...prev, { id: message.id, instruction: null, content: message.content }];
      });
    },
    onError: () => failPending(),
  });

  // Drops the version being written so the user can try again.
  const failPending = () => {
    setRefinements((prev) => {
      const last = prev[prev.length - 1];
      return last && last.content === null && last.id.startsWith(PENDING_PREFIX)
        ? prev.slice(0, -1)
        : prev;
    });
    setError("Couldn't refine the draft. Try again.");
  };

  const versions = original ? [original, ...refinements] : refinements;
  const latest = versions[versions.length - 1];
  const awaitingResponse = !!latest && latest.content === null;
  const refining = awaitingResponse && latest.id.startsWith(PENDING_PREFIX);

  // No result and no error in time: treat the refinement as failed.
  usePendingTimeout(refining, lastActivity, failPending);

  // Refines the latest version with a new instruction.
  const refine = async (instruction: string) => {
    setError(null);
    if (awaitingResponse || !latest || latest.id.startsWith(PENDING_PREFIX)) return;
    const pendingId = `${PENDING_PREFIX}${Date.now()}`;

    setRefinements((prev) => [...prev, { id: pendingId, instruction, content: null }]);

    try {
      await chatApi.refineMessage({ responseId: latest.id, payload: { content: instruction } });
    } catch (err) {
      console.error("Failed to refine draft:", err);
      setError("Couldn't refine the draft. Try again.");
      setRefinements((prev) => prev.filter((v) => v.id !== pendingId));
    }
  };

  return {
    versions,
    awaitingResponse,
    error: error ?? threadError?.message ?? null,
    refine,
  };
};
