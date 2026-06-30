import { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate, useRouteLoaderData } from "react-router";
import type { Route } from "../+types/index";
import type { clientLoader as dashboardLoader } from "~/routes/dashboard/index";
import PostPreview from "~/components/chat/post-preview";
import { ChatForm } from "~/components/chat-form";
import { chatApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import { useConversationSocket } from "~/hooks/useConversationSocket";
import type { ChatGetMessagesDto, Message } from "~/types";
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const {
    execute: loadMessages,
    prefetch: prefetchMessages,
    data: history,
    loading,
    error: loadError,
  } = useApiCall<ChatGetMessagesDto, Message[]>(chatApi.getMessages, {
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
    if (history) setMessages(history);
  }, [history]);

  const { isTyping, error: socketError } = useConversationSocket({
    conversationId,
    onMessageReceived: (message) => {
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
    },
  });

  const handleSendMessage = async (content: string) => {
    setError(null);
    try {
      const userMessage = await chatApi.addMessage({
        conversationId,
        payload: { content, type: "MULTIPLE" },
      });
      setMessages((prev) =>
        prev.some((m) => m.id === userMessage.id)
          ? prev
          : [...prev, userMessage],
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

  const responses = messages.filter(
    (m) => m.role.toLowerCase() === "assistant",
  );
  const promptCount = messages.filter(
    (m) => m.role.toLowerCase() === "user",
  ).length;

  const isLoadingHistory = (loading || history === null) && !loadError;
  const displayError = error ?? socketError ?? loadError?.message ?? null;

  return (
    <div className="post-chat-container">
      {isLoadingHistory && messages.length === 0 ? (
        <div className="preview-frame preview-frame--loading">
          <div className="preview-empty">
            <h3>Loading…</h3>
          </div>
        </div>
      ) : (
        <PostPreview
          responses={responses}
          isTyping={isTyping}
          user={user}
          onRefine={handleRefine}
        />
      )}

      {displayError && <div className="error-message">{displayError}</div>}

      <div className="chat-input-section">
        <ChatForm
          refineDraft={draft}
          onClearRefine={() => setDraft("")}
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
