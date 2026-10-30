import { useCallback, useEffect } from "react";
import { ChatTextIcon } from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router";
import { useApiCall } from "~/hooks/useApiCall";
import { conversationApi } from "~/api/endpoints";
import { getSocket } from "~/services/socket";
import type { MessageEvent } from "~/hooks/useConversationSocket";
import type { ConversationListDto, Conversation, Page } from "~/types";
import "~/styles/components/recent-chats.scss";

const DTO = { take: 15 } satisfies ConversationListDto;

export const RecentChats = () => {
  const { execute, prefetch, data, loading } = useApiCall<
    ConversationListDto,
    Page<Conversation>
  >(conversationApi.list, { cacheKey: "recent-conversations-page" });
  const conversations = data?.items;

  useEffect(() => {
    execute(DTO);
  }, []);

  // Refetch when a turn's drafts land so a new conversation shows up without a
  // reload. Each draft is its own event; the turn's first one triggers the fetch.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    let lastTurnId: string | null = null;
    const refresh = ({ messageGroupId }: MessageEvent) => {
      if (messageGroupId === lastTurnId) return;
      lastTurnId = messageGroupId;
      execute(DTO);
    };
    socket.on("message:received", refresh);
    return () => {
      socket.off("message:received", refresh);
    };
  }, [execute]);

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
