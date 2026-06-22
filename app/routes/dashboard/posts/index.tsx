import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ChatTextIcon, PlusCircleIcon } from "@phosphor-icons/react";
import { useApiCall } from "~/hooks/useApiCall";
import { conversationApi } from "~/api/endpoints";
import type { Conversation, ConversationListDto } from "~/types";
import "~/styles/dashboard/posts.scss";

const Posts = () => {
  const navigate = useNavigate();
  const { execute, data: conversations, loading } = useApiCall<ConversationListDto, Conversation[]>(conversationApi.list);

  useEffect(() => {
    execute({ cursor: "", take: 50 });
  }, []);

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>Posts</h1>
        <button className="new-post-btn" onClick={() => navigate("/posts/new")}>
          <PlusCircleIcon size={20} weight="bold" />
          New Post
        </button>
      </div>

      {loading && <div className="posts-loading">Loading conversations...</div>}

      {!loading && conversations && conversations.length === 0 && (
        <div className="empty-state">
          <ChatTextIcon size={48} />
          <h2>No conversations yet</h2>
          <p>Start a new post to begin generating ideas</p>
        </div>
      )}

      {!loading && conversations && conversations.length > 0 && (
        <div className="conversation-list">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="conversation-card"
              onClick={() => navigate(`/posts/${conv.id}`)}
            >
              <div className="conversation-card-header">
                <ChatTextIcon size={20} />
                <span className="conversation-date">
                  {new Date(conv.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="conversation-title">{conv.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
