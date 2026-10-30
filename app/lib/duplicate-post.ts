import { isApiError } from "~/api/error";

// The server refuses to publish text the user has already posted (409) and
// returns the earlier post's X id. This reads that id: `{ postId }` for a
// duplicate, null for any other failure.
export const alreadyPosted = (err: unknown): { postId: string | null } | null => {
  if (!isApiError(err) || err.code !== "CONFLICT") return null;

  const data = (err.details as { data?: unknown } | undefined)?.data;
  if (typeof data !== "object" || data === null || !("x_post_id" in data)) return null;

  const postId = (data as { x_post_id: unknown }).x_post_id;
  return { postId: typeof postId === "string" ? postId : null };
};
