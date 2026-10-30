import type { DraftPosted } from "~/types";

// Which drafts have been published, so the same draft can't be posted twice.
// The server's record (`posted` on drafts loaded from history) works across
// devices; this per-user localStorage record covers posts made since the
// history loaded. `resolvePosted` merges the two.

export interface PostedDraft {
  postId: string | null;
  text: string;
  postedAt: string;
}

export type PostedDrafts = Record<string, PostedDraft>;

// A draft as the screens hold it: its id, and the server's record if loaded.
export interface PostableDraft {
  id: string;
  posted?: DraftPosted | null;
}

// The most recent publish of a draft, from either record; null if never posted.
export const resolvePosted = (
  draft: PostableDraft,
  local: PostedDraft | undefined,
): PostedDraft | null => {
  const server: PostedDraft | null = draft.posted
    ? {
        postId: draft.posted.x_post_id,
        text: draft.posted.content,
        postedAt: draft.posted.published_at,
      }
    : null;
  if (!server || !local) return server ?? local ?? null;
  return Date.parse(local.postedAt) > Date.parse(server.postedAt) ? local : server;
};

const KEY_PREFIX = "vox:posted:";
const EMPTY: PostedDrafts = {};

const cache = new Map<string, PostedDrafts>();
const listeners = new Set<() => void>();

const storageKey = (userId: string) => `${KEY_PREFIX}${userId}`;

const read = (userId: string): PostedDrafts => {
  const key = storageKey(userId);
  const cached = cache.get(key);
  if (cached) return cached;

  let value = EMPTY;
  try {
    const raw = localStorage.getItem(key);
    if (raw) value = JSON.parse(raw) as PostedDrafts;
  } catch (err) {
    console.error("Failed to read posted drafts:", err);
  }
  cache.set(key, value);
  return value;
};

export const postedDrafts = {
  empty: EMPTY,

  get: read,

  mark: (userId: string, draftId: string, record: PostedDraft) => {
    const key = storageKey(userId);
    const next = { ...read(userId), [draftId]: record };
    cache.set(key, next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save posted draft:", err);
    }
    listeners.forEach((notify) => notify());
  },

  // Shape required by useSyncExternalStore; also picks up posts made in other tabs.
  subscribe: (listener: () => void) => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.startsWith(KEY_PREFIX)) return;
      cache.delete(e.key);
      listener();
    };
    listeners.add(listener);
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
};

export const postUrl = (postId: string) => `https://x.com/i/web/status/${postId}`;
