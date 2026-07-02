import { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate, useRouteLoaderData } from "react-router";
import type { Route } from "../+types/index";
import type { clientLoader as dashboardLoader } from "~/routes/dashboard/index";
import PostPreview from "~/components/chat/post-preview";
import { ChatForm } from "~/components/chat-form";
import { chatApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import { useConversationSocket } from "~/hooks/useConversationSocket";
import type { ChatGetMessagesDto, Message, Turn } from "~/types";
import "~/styles/dashboard/posts.scss";

const MAX_PROMPTS = 6;

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  return { conversationId: id || "" };
}

const Post = () => {
  const { conversationId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const dashboardData = useRouteLoaderData<typeof dashboardLoader>(
    "routes/dashboard/index",
  );
  const user = dashboardData?.user;

  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    execute: loadMessages,
    prefetch: prefetchMessages,
    data: history,
    loading,
    error: loadError,
  } = useApiCall<ChatGetMessagesDto, Turn[]>(chatApi.getMessages, {
    cacheKey: "conversation-messages",
  });

  const messagesDto = { conversationId, cursor: "", take: 50 } satisfies ChatGetMessagesDto;

  useEffect(() => {
    if (!conversationId) return;
    loadMessages(messagesDto);
  }, [conversationId]);

  const { pathname } = useLocation();
  useEffect(() => {
    if (!conversationId) return;
    prefetchMessages(messagesDto);
  }, [pathname]);

  useEffect(() => {
    if (history) setTurns(history);
  }, [history]);

  const { isTyping, error: socketError } = useConversationSocket({
    conversationId,
    onMessageReceived: ({ messageGroupId, message }) => {
      // Append the streamed response option into its turn.
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
  });

  const handleSendMessage = async (content: string) => {
    setError(null);
    try {
      const turn = await chatApi.addMessage({
        conversationId,
        payload: { content, type: "MULTIPLE" },
      });
      setTurns((prev) =>
        prev.some((t) => t.turnId === turn.turnId) ? prev : [...prev, turn],
      );
    } catch {
      setError("Failed to send message");
    }
  };

  const handleRefine = (message: Message) => {
    navigate(`/posts/${conversationId}/r/${message.id}`, {
      state: { draft: message.content },
    });
  };

  const promptCount = turns.length;
  const isLoadingHistory = (loading || history === null) && !loadError;
  const displayError = error ?? socketError ?? loadError?.message ?? null;

  return (
    <div className="post-chat-container">
      {isLoadingHistory && turns.length === 0 ? (
        <div className="preview-frame preview-frame--loading">
          <div className="preview-empty">
            <h3>Loading…</h3>
          </div>
        </div>
      ) : (
        <PostPreview
          turns={turns}
          isTyping={isTyping}
          user={user}
          onRefine={handleRefine}
        />
      )}

      {displayError && <div className="error-message">{displayError}</div>}

      <div className="chat-input-section">
        <ChatForm
          onSubmit={handleSendMessage}
          promptCount={promptCount}
          maxPrompts={MAX_PROMPTS}
          disabled={promptCount >= MAX_PROMPTS}
        />
      </div>
    </div>
  );
};

export default Post;
