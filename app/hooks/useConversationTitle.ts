import { useEffect } from "react";
import { conversationApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import type { Conversation, ConversationGetDto } from "~/types";

// A post's title for headers. `failed` lets callers fall back to a generic label.
export const useConversationTitle = (conversationId: string) => {
  const { execute, data, error } = useApiCall<ConversationGetDto, Conversation>(
    conversationApi.get,
    { cacheKey: "conversation" },
  );

  useEffect(() => {
    if (!conversationId) return;
    execute({ id: conversationId });
  }, [conversationId]);

  return { title: data?.title ?? null, failed: !!error };
};
