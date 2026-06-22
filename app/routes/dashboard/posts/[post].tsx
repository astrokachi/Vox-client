import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/[post]";
import UserMessage from "~/components/chat/user-message";
import AgentResponse from "~/components/chat/agent-response";
import TypingIndicator from "~/components/chat/typing-indicator";
import { ChatForm } from "~/components/chat-form";
import { chatApi } from "~/api/endpoints";
import { getSocket } from "~/services/socket";
import type { Message } from "~/types";
import "~/styles/dashboard/posts.scss";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  return { conversationId: id || "" };
}

const Post = () => {
  const { conversationId } = useLoaderData<typeof loader>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing history over REST (once per conversation).
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;

    setLoading(true);
    chatApi
      .getMessages({ conversationId, cursor: "", take: 50 })
      .then((page) => {
        if (!cancelled) setMessages(page.messages);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load messages");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  // Subscribe to live updates over WebSocket.
  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit("conversation:join", conversationId);

    const appendMessage = (message: Message) => {
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message]
      );
    };

    const handleReceived = (message: Message) => {
      if (message.conversation_id !== conversationId) return;
      setIsTyping(false);
      appendMessage(message);
    };

    const handleTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId === conversationId) setIsTyping(true);
    };

    const handleError = (payload: { conversationId: string; error: string }) => {
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
      // Persist the prompt over REST; the AI reply streams back over WebSocket.
      const userMessage = await chatApi.addMessage({
        conversationId,
        payload: { content, type: "MULTIPLE" },
      });
      setMessages((prev) =>
        prev.some((m) => m.id === userMessage.id) ? prev : [...prev, userMessage]
      );
      setIsTyping(true);
    } catch {
      setError("Failed to send message");
    }
  };

  return (
    <div className="post-chat-container">
      <div className="chat-messages-wrapper">
        <div className="chat-messages">
          {loading && messages.length === 0 ? (
            <div className="empty-state">
              <h2>Loading...</h2>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <h2>Generate Post Ideas</h2>
              <p>Start a conversation to get AI-powered post suggestions</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message-group message-${msg.role}`}>
                {msg.role.toLowerCase() === "user" ? (
                  <UserMessage content={msg.content} />
                ) : (
                  <AgentResponse content={msg.content} id={msg.id} type={msg.type} />
                )}
              </div>
            ))
          )}

          {isTyping && (
            <div className="message-group message-assistant">
              <TypingIndicator />
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="chat-input-section">
        <ChatForm onSubmit={handleSendMessage} />
      </div>
    </div>
  );
};

export default Post;
