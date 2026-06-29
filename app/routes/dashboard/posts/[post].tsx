import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useRouteLoaderData } from "react-router";
import type { Route } from "../+types/index";
import type { clientLoader as dashboardLoader } from "~/routes/dashboard/index";
import PostPreview from "~/components/chat/post-preview";
import { ChatForm } from "~/components/chat-form";
import { chatApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import { getSocket } from "~/services/socket";
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
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const {
    execute: loadMessages,
    data: history,
    loading,
    error: loadError,
  } = useApiCall<ChatGetMessagesDto, Message[]>(chatApi.getMessages);

  useEffect(() => {
    if (!conversationId) return;
    loadMessages({ conversationId, cursor: "", take: 50 });
  }, [conversationId]);

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit("conversation:join", conversationId);

    const handleReceived = (message: Message) => {
      if (message.conversation_id !== conversationId) return;
      setIsTyping(false);
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
    };

    const handleTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId === conversationId) setIsTyping(true);
    };

    const handleError = (payload: {
      conversationId: string;
      error: string;
    }) => {
      if (payload.conversationId !== conversationId) return;
      setIsTyping(false);
      setError(payload.error);
    };

    socket.on("message:received", handleReceived);
    socket.on("message:typing", handleTyping);
    socket.on("message:error", handleError);

    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.off("message:received", handleReceived);
      socket.off("message:typing", handleTyping);
      socket.off("message:error", handleError);
    };
  }, [conversationId]);

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
      setIsTyping(true);
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
  const displayError = error ?? loadError?.message ?? null;

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
