import { useCallback, useSyncExternalStore } from "react";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { usePost } from "~/hooks/usePost";
import {
  postedDrafts,
  resolvePosted,
  type PostableDraft,
  type PostedDraft,
} from "~/lib/posted-drafts";

export interface PublishOutcome {
  record: PostedDraft;
  // The server refused because this text was already posted; nothing new went out.
  duplicate: boolean;
}

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
    (draft: PostableDraft): PostedDraft | null => resolvePosted(draft, posted[draft.id]),
    [posted],
  );

  const publish = async (
    draftId: string,
    text: string,
    files?: File[],
  ): Promise<PublishOutcome | null> => {
    const result = await post(text, files, draftId);
    if (!result) return null;

    const record: PostedDraft = {
      postId: result.postId,
      text,
      postedAt: new Date().toISOString(),
    };
    postedDrafts.mark(userId, draftId, record);
    return { record, duplicate: result.duplicate };
  };

  return { publish, posting, getPosted };
};
