import { useCallback, useSyncExternalStore } from "react";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { usePost } from "~/hooks/usePost";
import { postedDrafts, type PostedDraft } from "~/lib/posted-drafts";

// Publishes a draft to X and remembers that it was posted.
export const usePublishDraft = () => {
  const userId = useCurrentUser()?.user_id ?? "anonymous";
  const { post, posting } = usePost();

  const posted = useSyncExternalStore(
    postedDrafts.subscribe,
    () => postedDrafts.get(userId),
    () => postedDrafts.empty,
  );

  const getPosted = useCallback(
    (draftId: string): PostedDraft | null => posted[draftId] ?? null,
    [posted],
  );

  const publish = async (
    draftId: string,
    text: string,
    files?: File[],
  ): Promise<PostedDraft | null> => {
    const result = await post(text, files);
    if (!result) return null;

    const record: PostedDraft = {
      postId: result.postId,
      text,
      postedAt: new Date().toISOString(),
    };
    postedDrafts.mark(userId, draftId, record);
    return record;
  };

  return { publish, posting, getPosted };
};
