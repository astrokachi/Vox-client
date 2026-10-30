import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { Route } from "../+types/index";
import PageHeader from "~/components/layouts/page-header";
import TurnList, { TurnListSkeleton } from "~/components/chat/turn-list";
import PublishDialog, { type PublishableDraft } from "~/components/chat/publish-dialog";
import { ChatForm } from "~/components/chat-form";
import { useConversationTitle } from "~/hooks/useConversationTitle";
import { useDraftUsage } from "~/hooks/useDraftUsage";
import { useDrafts } from "~/hooks/useDrafts";
import { usePublishDraft } from "~/hooks/usePublishDraft";
import type { Message, Turn } from "~/types";
import "~/styles/dashboard/posts.scss";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  return { conversationId: id || "" };
}

const Post = () => {
  const { conversationId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { title, failed: titleFailed } = useConversationTitle(conversationId);
  const { turns, pendingTurnIds, isTyping, loading, error, sendPrompt, retry } =
    useDrafts(conversationId);
  const { usage, exhausted, refresh: refreshUsage } = useDraftUsage();
  const { getPosted } = usePublishDraft();
  const [toPublish, setToPublish] = useState<PublishableDraft | null>(null);

  const handleRefine = (draft: Message) => {
    navigate(`/posts/${conversationId}/r/${draft.id}`, {
      state: { draft: draft.content },
    });
  };

  const handleSend = async (content: string) => {
    await sendPrompt(content);
    refreshUsage();
  };

  const handleRetry = async (turn: Turn) => {
    await retry(turn);
    refreshUsage();
  };

  return (
    <div className="post-chat-container">
      <PageHeader
        crumbs={[
          { label: "Posts", to: "/posts" },
          { label: title ?? (titleFailed ? "Post" : undefined) },
        ]}
      />

      <div className="post-chat-body">
        {loading ? (
          <TurnListSkeleton />
        ) : (
          <TurnList
            turns={turns}
            pendingTurnIds={pendingTurnIds}
            isTyping={isTyping}
            canRetry={!exhausted}
            getPosted={getPosted}
            onRefine={handleRefine}
            onPost={setToPublish}
            onRetry={handleRetry}
          />
        )}
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      <div className="chat-input-section">
        {exhausted ? (
          <p className="prompt-limit">
            You've used all {usage?.limit} free drafts.
          </p>
        ) : (
          <ChatForm
            onSubmit={handleSend}
            usage={usage}
            submitLabel="New drafts"
            placeholder="Try another angle"
          />
        )}
      </div>

      {toPublish && (
        <PublishDialog draft={toPublish} onClose={() => setToPublish(null)} />
      )}
    </div>
  );
};

export default Post;
