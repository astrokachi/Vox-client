import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { chatApi } from "~/api/endpoints";
import { draftLimitMessage } from "~/lib/chat-limits";

// Starts a post from a first prompt and opens it once it exists.
export const useStartPost = () => {
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const start = useCallback(
    async (content: string) => {
      setStarting(true);
      setError(null);
      try {
        const conversation = await chatApi.createWithPrompt({
          payload: { content, type: "MULTIPLE" },
        });
        navigate(`/posts/${conversation.id}`);
      } catch (err) {
        console.error("Failed to start post:", err);
        setError(
          draftLimitMessage(err) ??
            "Couldn't start this post. Check your connection and try again.",
        );
      } finally {
        setStarting(false);
      }
    },
    [navigate],
  );

  return { start, starting, error };
};
