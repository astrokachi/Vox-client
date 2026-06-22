import { useEffect } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/[post]";
import UserMessage from "~/components/chat/user-message";
import AgentResponse from "~/components/chat/agent-response";
import { ChatForm } from "~/components/chat-form";
import { useApiCall } from "~/hooks/useApiCall";
import { chatApi } from "~/api/endpoints";
import "~/styles/dashboard/posts.scss";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  return { conversationId: id || "" };
}

const Post = () => {
  const { conversationId } = useLoaderData<typeof loader>();
  const { execute: loadMessages, data: messagesData, loading } = useApiCall(chatApi.getMessages);
  const { execute: sendMessage } = useApiCall(chatApi.addMessage);

  useEffect(() => {
    if (!conversationId) return;
    loadMessages({ conversationId, cursor: "", take: 50 });
  }, [conversationId]);

  const handleSendMessage = async (content: string) => {
    await sendMessage({
      conversationId,
      payload: { content, type: "MULTIPLE" },
    });
    loadMessages({ conversationId, cursor: "", take: 50 });
  };

  const apiMessages = messagesData ?? [];

  return (
    <div className="post-chat-container">
      <div className="chat-messages-wrapper">
        <div className="chat-messages">
          {loading && apiMessages.length === 0 ? (
            <div className="empty-state">
              <h2>Loading...</h2>
            </div>
          ) : apiMessages.length === 0 ? (
            <div className="empty-state">
              <h2>Generate Post Ideas</h2>
              <p>Start a conversation to get AI-powered post suggestions</p>
            </div>
          ) : (
            apiMessages.map((msg) => (
              <div key={msg.id} className={`message-group message-${msg.role}`}>
                {msg.role.toLowerCase() === 'user' ? (
                  <UserMessage content={msg.content} />
                ) : (
                  <AgentResponse content={msg.content} id={msg.id} type={msg.type} />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-input-section">
        <ChatForm onSubmit={handleSendMessage} />
      </div>
    </div>
  );
};

export default Post;
