import { useEffect, useRef, useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router";
import type { Route } from "../+types/index";
import type { clientLoader as dashboardLoader } from "~/routes/dashboard/index";
import PostPreview from "~/components/chat/post-preview";
import RefineHeader from "~/components/chat/refine-header";
import RefineDraftCard from "~/components/chat/refine-draft-card";
import RefinedOutputCard from "~/components/chat/refined-output-card";
import PreviewPostModal from "~/components/chat/preview-post-modal";
import { ChatForm } from "~/components/chat-form";
import { chatApi } from "~/api/endpoints";
import { useApiCall } from "~/hooks/useApiCall";
import { getSocket } from "~/services/socket";
import { formatContent } from "~/utils/format-content";
import type { ChatGetMessagesDto, Message } from "~/types";
import "~/styles/dashboard/posts.scss";

const MAX_PROMPTS = 6;

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  return { conversationId: id || "" };
}

const Post = () => {
  const { conversationId } = useLoaderData<typeof loader>();
  const dashboardData = useRouteLoaderData<typeof dashboardLoader>("routes/dashboard/index");
  const user = dashboardData?.user;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  // Refine mode state
  const [refineMode, setRefineMode] = useState(false);
  const [refinedDraft, setRefinedDraft] = useState("");
  const [refinedPreviewText, setRefinedPreviewText] = useState<string | null>(null);
  const refineModeBaseRef = useRef(0);

  const {
    execute: loadMessages,
    data: history,
    loading,
    error: loadError,
  } = useApiCall<ChatGetMessagesDto, Message[]>(chatApi.getMessages);

  useEffect(() => {
    if (!conversationId) return;
    loadMessages({ conversationId, cursor: "", take: 50 });
  }, [conversationId]);

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit("conversation:join", conversationId);

    const appendMessage = (message: Message) => {
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message]
      );
    };

    const handleReceived = (message: Message) => {
      if (message.conversation_id !== conversationId) return;
      setIsTyping(false);
      appendMessage(message);
    };

    const handleTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId === conversationId) setIsTyping(true);
    };

    const handleError = (payload: { conversationId: string; error: string }) => {
      if (payload.conversationId !== conversationId) return;
      setIsTyping(false);
      setError(payload.error);
    };

    socket.on("message:received", handleReceived);
    socket.on("message:typing", handleTyping);
    socket.on("message:error", handleError);

    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.off("message:received", handleReceived);
      socket.off("message:typing", handleTyping);
      socket.off("message:error", handleError);
    };
  }, [conversationId]);

  const handleSendMessage = async (content: string) => {
    setError(null);
    try {
      const userMessage = await chatApi.addMessage({
        conversationId,
        payload: { content, type: "MULTIPLE" },
      });
      setMessages((prev) =>
        prev.some((m) => m.id === userMessage.id) ? prev : [...prev, userMessage]
      );
      setIsTyping(true);
    } catch {
      setError("Failed to send message");
    }
  };

  // Enter refine mode: snapshot current response count so we can derive the
  // refined output as any assistant message that arrives after this point.
  const handleRefine = (text: string) => {
    refineModeBaseRef.current = responses.length;
    setRefinedDraft(text.trim());
    setRefineMode(true);
    setDraft(text.trim());
  };

  const handleBackFromRefine = () => {
    setRefineMode(false);
    setRefinedDraft("");
    setDraft("");
    setRefinedPreviewText(null);
  };

  const responses = messages.filter((m) => m.role.toLowerCase() === "assistant");
  const promptCount = messages.filter((m) => m.role.toLowerCase() === "user").length;

  // The assistant response(s) that arrived after refine mode was activated.
  const refineResponses = refineMode ? responses.slice(refineModeBaseRef.current) : [];
  const latestRefineOutput = refineResponses.at(-1) ?? null;
  const latestRefineContent = latestRefineOutput
    ? (formatContent(latestRefineOutput.content, latestRefineOutput.type).parts[0] ?? null)
    : null;

  const isLoadingHistory = (loading || history === null) && !loadError;
  const displayError = error ?? loadError?.message ?? null;

  return (
    <div className="post-chat-container">
      {refineMode ? (
        <div className="preview-frame">
          <div className="refine-mode-container">
            <RefineHeader onBack={handleBackFromRefine} />
            <RefineDraftCard content={refinedDraft} />
            <RefinedOutputCard
              content={latestRefineContent}
              isTyping={isTyping}
              user={user}
              onPreview={setRefinedPreviewText}
            />
        </div>
        </div>
      ) : isLoadingHistory && messages.length === 0 ? (
        <div className="preview-frame preview-frame--loading">
          <div className="preview-empty">
            <h3>Loading…</h3>
          </div>
        </div>
      ) : (
        <PostPreview
          responses={responses}
          isTyping={isTyping}
          user={user}
          onRefine={handleRefine}
        />
      )}

      {displayError && <div className="error-message">{displayError}</div>}

      <div className="chat-input-section">
        <ChatForm
          refineDraft={refineMode ? undefined : draft}
          onClearRefine={() => setDraft("")}
          onSubmit={handleSendMessage}
          promptCount={promptCount}
          maxPrompts={MAX_PROMPTS}
          disabled={promptCount >= MAX_PROMPTS}
        />
      </div>

      {refinedPreviewText && (
        <PreviewPostModal
          content={refinedPreviewText}
          displayName={user?.name}
          handle={user?.username ? `@${user.username}` : undefined}
          onClose={() => setRefinedPreviewText(null)}
          onRefine={(text) => {
            setRefinedPreviewText(null);
            handleRefine(text);
          }}
        />
      )}
    </div>
  );
};

export default Post;
