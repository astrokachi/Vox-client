import { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate, useRouteLoaderData } from "react-router";
import type { Route } from "../+types/index";
import type { clientLoader as dashboardLoader } from "~/routes/dashboard/index";
import RefineHeader from "~/components/chat/refine-header";
import RefineDraftCard from "~/components/chat/refine-draft-card";
import RefinedOutputCard from "~/components/chat/refined-output-card";
import PreviewPostModal from "~/components/chat/preview-post-modal";
import { ChatForm } from "~/components/chat-form";
import { chatApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import { useConversationSocket } from "~/hooks/useConversationSocket";
import type { ChatGetThreadDto, Turn } from "~/types";
import "~/styles/dashboard/posts.scss";

// One step in the refinement history: the instruction (question) that was
// asked and the refined post it produced. The very first entry is the original
// draft being refined and has no question.
interface HistoryEntry {
  id: string;
  question: string | null;
  answer: string | null;
}

export async function loader({ params }: Route.LoaderArgs) {
  return { postId: params.id, messageId: params.messageId };
}

const RefineMessage = () => {
  const { postId, messageId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const dashboardData = useRouteLoaderData<typeof dashboardLoader>(
    "routes/dashboard/index",
  );
  const user = dashboardData?.user;

  const location = useLocation();
  const parentDraft =
    (location.state as { draft?: string } | null)?.draft ?? "";

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const {
    execute: loadThread,
    prefetch: prefetchThread,
    data: threadData,
    error: loadError,
  } = useApiCall<ChatGetThreadDto, Turn[]>(chatApi.getThread, {
    cacheKey: "message-thread",
  });

  const threadDto = { responseId: messageId ?? "" } satisfies ChatGetThreadDto;

  useEffect(() => {
    if (!messageId) return;
    loadThread(threadDto);
  }, [messageId]);

  const { pathname } = location;
  useEffect(() => {
    if (!messageId) return;
    prefetchThread(threadDto);
  }, [pathname]);

  // Build the history: the original draft, then each refinement turn
  // (its instruction + the refined answer).
  useEffect(() => {
    if (!threadData) return;
    setHistory([
      { id: messageId ?? "origin", question: null, answer: parentDraft },
      ...threadData.map((t) => ({
        id: t.response.options[0]?.id ?? t.turnId,
        question: t.question?.content ?? null,
        answer: t.response.options[0]?.content ?? null,
      })),
    ]);
  }, [threadData, messageId, parentDraft]);

  const { isTyping, error: socketError } = useConversationSocket({
    conversationId: postId!,
    onMessageRefined: ({ message }) => {
      setHistory((prev) => {
        // Fill the most recent pending entry; otherwise append.
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].answer === null) {
            const copy = [...prev];
            copy[i] = { ...copy[i], id: message.id, answer: message.content };
            return copy;
          }
        }
        return [
          ...prev,
          { id: message.id, question: null, answer: message.content },
        ];
      });
    },
  });

  const last = history[history.length - 1];
  const awaitingResponse = !!last && last.answer === null;

  // Only the last entry can be refined.
  const handleSendMessage = async (content: string) => {
    setError(null);
    if (awaitingResponse || !last?.id) return;
    const targetId = last.id;

    setHistory((prev) => [
      ...prev,
      { id: `pending-${Date.now()}`, question: content, answer: null },
    ]);

    try {
      await chatApi.refineMessage({ responseId: targetId, payload: { content } });
    } catch {
      setError("Failed to send message");
      setHistory((prev) =>
        prev.filter((e) => !(e.answer === null && e.question === content)),
      );
    }
  };

  const handleBack = () => navigate(`/posts/${postId}`);
  const displayError = error ?? socketError ?? loadError?.message ?? null;

  return (
    <div className="post-chat-container">
      <div className="preview-frame preview-frame--refine">
        <div className="refine-mode-container">
          <RefineHeader onBack={handleBack} />

          <div className="refine-history-list">
            {history.map((entry, i) => (
              <div key={entry.id} className="refine-entry">
                {entry.question === null ? (
                  <RefineDraftCard content={entry.answer ?? ""} />
                ) : (
                  <>
                    <div className="turn-question">{entry.question}</div>
                    <RefinedOutputCard
                      content={entry.answer}
                      isTyping={isTyping && i === history.length - 1}
                      user={user}
                      onPreview={setPreviewContent}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {displayError && <div className="error-message">{displayError}</div>}

      <div className="chat-input-section">
        <ChatForm
          onSubmit={handleSendMessage}
          promptCount={0}
          maxPrompts={99}
          submitLabel="Refine"
          disabled={awaitingResponse}
        />
      </div>

      {previewContent && (
        <PreviewPostModal
          content={previewContent}
          displayName={user?.name}
          handle={user?.username ? `@${user.username}` : undefined}
          onClose={() => setPreviewContent(null)}
        />
      )}
    </div>
  );
};

export default RefineMessage;
