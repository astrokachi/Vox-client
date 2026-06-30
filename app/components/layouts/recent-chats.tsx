import { useCallback, useEffect } from "react";
import { ChatTextIcon } from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router";
import { useApiCall } from "~/hooks/useApiCall";
import { conversationApi } from "~/api/endpoints";
import type { ConversationListDto, Conversation } from "~/types";
import "~/styles/components/recent-chats.scss";

const DTO = { take: 15 } satisfies ConversationListDto;

export const RecentChats = () => {
  const { execute, prefetch, data: conversations, loading } = useApiCall<
    ConversationListDto,
    Conversation[]
  >(conversationApi.list, { cacheKey: "recent-conversations" });

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
    <section className="recents-con">
      <span className="recents-title">Recents</span>

      {loading && (
        <div className="recents-loading">
          <div className="recents-skeleton" />
          <div className="recents-skeleton" />
          <div className="recents-skeleton" />
        </div>
      )}

      {!loading && conversations && conversations.length > 0 && (
        <div className="recents-list" onMouseEnter={handleHover}>
          {conversations.map((conv) => (
            <NavLink
              key={conv.id}
              to={`/posts/${conv.id}`}
              className={({ isActive }) =>
                `recents-item${isActive ? " recents-item--active" : ""}`
              }
            >
              <ChatTextIcon size={16} className="recents-item-icon" />
              <span className="recents-item-title">{conv.title}</span>
            </NavLink>
          ))}
        </div>
      )}

      {!loading && conversations && conversations.length === 0 && (
        <p className="recents-empty">No conversations yet</p>
      )}
    </section>
  );
};
