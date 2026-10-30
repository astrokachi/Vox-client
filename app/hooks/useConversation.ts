import { useEffect } from "react";
import { conversationApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import type { Conversation, ConversationGetDto } from "~/types";

// A post's header details: its title and its latest publish to X.
// `failed` lets callers fall back to a generic title; `refresh` re-reads it
// after something changes it (e.g. a publish).
export const useConversation = (conversationId: string) => {
  const { execute, data, error } = useApiCall<ConversationGetDto, Conversation>(
    conversationApi.get,
    { cacheKey: "conversation" },
  );

  const refresh = () => {
    if (conversationId) execute({ id: conversationId });
  };

  // Keyed on the id only: `execute` isn't stable across renders.
  useEffect(refresh, [conversationId]);

  return {
    title: data?.title ?? null,
    publishedPost: data?.published_post ?? null,
    failed: !!error,
    refresh,
  };
};
