import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { Route } from "../+types/index";
import PageHeader from "~/components/layouts/page-header";
import LoadError from "~/components/load-error";
import TurnList, { TurnListSkeleton } from "~/components/chat/turn-list";
import OutOfDrafts from "~/components/chat/out-of-drafts";
import PostStatus from "~/components/chat/post-status";
import PublishDialog, { type PublishableDraft } from "~/components/chat/publish-dialog";
import { ChatForm } from "~/components/chat-form";
import { useConversation } from "~/hooks/useConversation";
import { useDraftUsage } from "~/hooks/useDraftUsage";
import { useDrafts } from "~/hooks/useDrafts";
import { usePublishDraft } from "~/hooks/usePublishDraft";
import { costHint } from "~/lib/draft-cost";
import { postUrl } from "~/lib/posted-drafts";
import type { Message, Turn } from "~/types";
import "~/styles/dashboard/posts.scss";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  return { conversationId: id || "" };
}

const Post = () => {
  const { conversationId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const {
    title,
    publishedPost,
    failed: titleFailed,
    refresh: refreshConversation,
  } = useConversation(conversationId);
  const {
    turns,
    pendingTurnIds,
    isTyping,
    loading,
    loadError,
    reload,
    error,
    sendPrompt,
    retry,
  } = useDrafts(conversationId);
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
      <div className="post-chat-head">
        <PageHeader
          crumbs={[
            { label: "Posts", to: "/posts" },
            { label: title ?? (titleFailed ? "Post" : undefined) },
          ]}
        />
        {publishedPost && (
          <PostStatus
            publishedAt={publishedPost.published_at}
            url={publishedPost.x_post_id ? postUrl(publishedPost.x_post_id) : null}
          />
        )}
      </div>

      <div className="post-chat-body">
        {loadError && <LoadError message={loadError} onRetry={reload} />}
        {loading ? (
          <TurnListSkeleton />
        ) : (
          !(loadError && turns.length === 0) && (
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
          )
        )}
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      <div className="chat-input-section">
        {exhausted ? (
          <OutOfDrafts
            limit={usage?.limit}
            next={turns.length > 0 ? "You can still post any draft above." : undefined}
          />
        ) : (
          <ChatForm
            onSubmit={handleSend}
            hint={usage ? costHint(usage, "set") : null}
            submitLabel="New drafts"
            placeholder="Try another angle"
          />
        )}
      </div>

      {toPublish && (
        <PublishDialog
          draft={toPublish}
          onClose={() => setToPublish(null)}
          onPublished={refreshConversation}
        />
      )}
    </div>
  );
};

export default Post;
