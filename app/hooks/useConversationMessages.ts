import { useEffect } from "react";
import { useLocation } from "react-router";
import { chatApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import type { ChatGetMessagesDto, Turn } from "~/types";

// A post's turns (prompt + drafts). Shared by the drafts and refine screens so
// both read the same cache entry.
export const useConversationMessages = (conversationId: string) => {
  const { execute, prefetch, data, loading, error } = useApiCall<
    ChatGetMessagesDto,
    Turn[]
  >(chatApi.getMessages, { cacheKey: "conversation-messages" });

  const dto = { conversationId, cursor: "", take: 50 } satisfies ChatGetMessagesDto;

  useEffect(() => {
    if (!conversationId) return;
    execute(dto);
  }, [conversationId]);

  const { pathname } = useLocation();
  useEffect(() => {
    if (!conversationId) return;
    prefetch(dto);
  }, [pathname]);

  return { turns: data, loading: (loading || data === null) && !error, error };
};
