import { useState } from "react";
import { postApi } from "~/api/endpoints";
import { useToast } from "~/hooks/use-toast";

export interface PostResult {
  // The new post's id on X; null if the response didn't include one.
  postId: string | null;
}

export const usePost = () => {
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const { addToast } = useToast();

  // Resolves to null when publishing failed (the error is toasted).
  const post = async (text: string, files?: File[]): Promise<PostResult | null> => {
    setPosting(true);
    setPostError(null);

    try {
      const formData = new FormData();
      formData.append("message", text);
      if (files) {
        for (const file of files) {
          formData.append("media", file);
        }
      }

      const res = await postApi.post(formData);
      addToast("Post published successfully", "success");
      return { postId: res?.data?.id ?? null };
    } catch (err) {
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
