import { useMemo } from "react";
import { postApi } from "~/api/endpoints";
import { groupByDay } from "~/utils/group-by-day";
import type { SentPost } from "~/types";
import { useCursorList } from "./useCursorList";

const PAGE_SIZE = 30;

const fetchPublished = (cursor?: string) => postApi.listSent({ cursor, take: PAGE_SIZE });

// Posts published to X from Vox, newest first, grouped by day.
export const usePublishedPosts = () => {
  const list = useCursorList<SentPost>(fetchPublished, "published-posts");
  const groups = useMemo(
    () => groupByDay(list.items, (post) => post.published_at),
    [list.items],
  );
  return { ...list, groups };
};
