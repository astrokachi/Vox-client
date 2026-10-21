import { useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ChatTextIcon, PlusIcon } from "@phosphor-icons/react";
import { useApiCall } from "~/hooks/useApiCall";
import { conversationApi } from "~/api/endpoints";
import type { Conversation, ConversationListDto } from "~/types";
import { formatShortDate } from "~/utils/format-date";
import "~/styles/dashboard/conversation-list.scss";

const DTO = { cursor: "", take: 50 } satisfies ConversationListDto;
const SKELETON_ROWS = 5;

const Posts = () => {
  const { execute, prefetch, data: conversations, loading } = useApiCall<
    ConversationListDto,
    Conversation[]
  >(conversationApi.list, { cacheKey: "posts-index" });

  useEffect(() => {
    execute(DTO);
  }, []);

  const { pathname } = useLocation();
  useEffect(() => {
    prefetch(DTO);
  }, [pathname]);

  const handleHover = useCallback(() => {
    prefetch(DTO);
  }, [prefetch]);

  return (
    <div className="posts-container">
      <header className="posts-header">
        <h1 className="posts-title">Posts</h1>
        <Link className="new-post-btn" to="/posts/new">
          <PlusIcon size={14} weight="bold" />
          New post
        </Link>
      </header>

      {loading && (
        <ul className="conversation-list" aria-busy="true" aria-label="Loading posts">
          {Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <li key={i} className="conversation-row conversation-row--skeleton">
              <span className="conversation-skeleton" />
            </li>
          ))}
        </ul>
      )}

      {!loading && conversations && conversations.length === 0 && (
        <div className="empty-state">
          <ChatTextIcon size={28} />
          <h2>No posts yet</h2>
          <p>Start a new post to generate drafts.</p>
        </div>
      )}

      {!loading && conversations && conversations.length > 0 && (
        <ul className="conversation-list" onMouseEnter={handleHover}>
          {conversations.map((conv) => (
            <li key={conv.id}>
              <Link className="conversation-row" to={`/posts/${conv.id}`}>
                <span className="conversation-title">{conv.title}</span>
                <time className="conversation-date" dateTime={conv.created_at}>
                  {formatShortDate(conv.created_at)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Posts;
