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
import type { ChatGetMessageTreeDto, Message } from "~/types";
import "~/styles/dashboard/posts.scss";

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

  const [chain, setChain] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const {
    execute: loadTree,
    prefetch: prefetchTree,
    data: treeData,
    error: loadError,
  } = useApiCall<ChatGetMessageTreeDto, Message[]>(chatApi.getMessageTree, {
    cacheKey: "message-tree",
  });

  const treeDto = { conversationId: postId ?? "", messageId: messageId ?? "" } satisfies ChatGetMessageTreeDto;

  useEffect(() => {
    if (!postId || !messageId) return;
    loadTree(treeDto);
  }, [postId, messageId]);

  const { pathname } = useLocation();
  useEffect(() => {
    if (!postId || !messageId) return;
    prefetchTree(treeDto);
  }, [pathname]);

  useEffect(() => {
    if (treeData) setChain(treeData);
  }, [treeData]);

  const { isTyping, error: socketError } = useConversationSocket({
    conversationId: postId!,
    onMessageRefined: (payload) => {
      setChain((prev) => [...prev, payload.message]);
      setSelectedIndex(-1);
    },
  });

  const handleSendMessage = async (content: string) => {
    setError(null);
    const targetId = chain.length > 0 ? chain[chain.length - 1].id : messageId;
    if (!postId || !targetId) return;
    try {
      await chatApi.refineMessage({
        conversationId: postId,
        messageId: targetId,
        payload: { content },
      });
    } catch {
      setError("Failed to send message");
    }
  };

  const handleBack = () => {
    navigate(`/posts/${postId}`);
  };

  const activeIndex = selectedIndex >= 0 ? selectedIndex : chain.length - 1;
  const parentMessage =
    activeIndex == 0 ? chain[activeIndex] : chain[activeIndex - 1];
  const activeMessage = activeIndex > 0 ? chain[activeIndex] : null;

  const historyItems = chain.slice(0, activeIndex - 1).map((m) => ({
    id: m.id,
    content: m.content,
  }));

  const handleSelectHistory = (item: { id: string; content: string }) => {
    const idx = chain.findIndex((m) => m.id === item.id);
    if (idx >= 0) {
      setSelectedIndex(idx);
      setPreviewContent(item.content);
    }
  };

  const handlePreview = (text: string) => {
    setPreviewContent(text);
  };

  const displayError = error ?? socketError ?? loadError?.message ?? null;

  return (
    <div className="post-chat-container">
      <div className="preview-frame">
        <div className="refine-mode-container">
          <RefineHeader
            onBack={handleBack}
            history={historyItems}
            onSelectHistory={handleSelectHistory}
          />
          <RefineDraftCard content={parentMessage?.content ?? ""} />
          <RefinedOutputCard
            content={activeMessage?.content ?? null}
            isTyping={isTyping}
            user={user}
            onPreview={handlePreview}
          />
        </div>
      </div>

      {displayError && <div className="error-message">{displayError}</div>}

      <div className="chat-input-section">
        <ChatForm
          onSubmit={handleSendMessage}
          promptCount={0}
          maxPrompts={99}
          submitLabel="Refine"
        />
      </div>

      {previewContent && (
        <PreviewPostModal
          content={previewContent}
          displayName={user?.name}
          handle={user?.username ? `@${user.username}` : undefined}
          onClose={() => {
            setPreviewContent(null);
            setSelectedIndex(-1);
          }}
        />
      )}
    </div>
  );
};

export default RefineMessage;
