import { useState } from "react";
import { postApi } from "~/api/endpoints";
import { useToast } from "~/hooks/use-toast";
import { alreadyPosted } from "~/lib/duplicate-post";

export interface PostResult {
  // The post's id on X; null if the response didn't include one.
  postId: string | null;
  // True when this text had been posted before, so nothing new went out.
  duplicate: boolean;
}

export const usePost = () => {
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const { addToast } = useToast();

  // Resolves to null when publishing failed (the error is toasted).
  const post = async (
    text: string,
    files?: File[],
    draftId?: string,
  ): Promise<PostResult | null> => {
    setPosting(true);
    setPostError(null);

    try {
      const formData = new FormData();
      formData.append("message", text);
      if (draftId) formData.append("draft_id", draftId);
      if (files) {
        for (const file of files) {
          formData.append("media", file);
        }
      }

      const res = await postApi.post(formData);
      addToast("Post published successfully", "success");
      return { postId: res?.id ?? null, duplicate: false };
    } catch (err) {
      const duplicate = alreadyPosted(err);
      if (duplicate) return { postId: duplicate.postId, duplicate: true };

      const message =
        err instanceof Error ? err.message : "Failed to publish post";
      setPostError(message);
      addToast(message, "error");
      return null;
    } finally {
      setPosting(false);
    }
  };

  return { post, posting, postError };
};
