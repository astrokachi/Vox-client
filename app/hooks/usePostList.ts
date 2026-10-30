import { useMemo } from "react";
import { conversationApi } from "~/api/endpoints";
import { groupByDay } from "~/utils/group-by-day";
import type { Conversation } from "~/types";
import { useCursorList } from "./useCursorList";

const PAGE_SIZE = 30;

const fetchPosts = (cursor?: string) => conversationApi.list({ cursor, take: PAGE_SIZE });

// Every post (writing session), newest first, grouped by day.
export const usePostList = () => {
  const list = useCursorList<Conversation>(fetchPosts, "posts-list");
  const groups = useMemo(
    () => groupByDay(list.items, (post) => post.created_at),
    [list.items],
  );
  return { ...list, groups };
};
