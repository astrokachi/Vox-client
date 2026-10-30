import { useState } from "react";
import { useLoaderData, useLocation } from "react-router";
import type { Route } from "../+types/index";
import PageHeader from "~/components/layouts/page-header";
import VersionList from "~/components/chat/version-list";
import OutOfDrafts from "~/components/chat/out-of-drafts";
import PublishDialog, { type PublishableDraft } from "~/components/chat/publish-dialog";
import { ChatForm } from "~/components/chat-form";
import { useConversation } from "~/hooks/useConversation";
import { useDraftUsage } from "~/hooks/useDraftUsage";
import { usePublishDraft } from "~/hooks/usePublishDraft";
import { useRefineHistory } from "~/hooks/useRefineHistory";
import { costHint } from "~/lib/draft-cost";
import "~/styles/dashboard/posts.scss";

export async function loader({ params }: Route.LoaderArgs) {
  return { postId: params.id ?? "", messageId: params.messageId ?? "" };
}

const RefineMessage = () => {
  const { postId, messageId } = useLoaderData<typeof loader>();
  const location = useLocation();
  // Draft text handed over from the drafts screen; shown until the original loads.
  const handedOver = (location.state as { draft?: string } | null)?.draft;

  const { title, failed: titleFailed } = useConversation(postId);
  const { versions, awaitingResponse, error, refine } = useRefineHistory(
    postId,
    messageId,
    handedOver,
  );
  const { usage, exhausted, refresh: refreshUsage } = useDraftUsage();
  const { getPosted } = usePublishDraft();
  const [toPublish, setToPublish] = useState<PublishableDraft | null>(null);

  const draftsPath = `/posts/${postId}`;

  const handleRefine = async (instruction: string) => {
    await refine(instruction);
    refreshUsage();
  };

  return (
    <div className="post-chat-container">
      <PageHeader
        backTo={draftsPath}
        backLabel="Back to drafts"
        crumbs={[
          { label: "Posts", to: "/posts" },
          { label: title ?? (titleFailed ? "Post" : undefined), to: draftsPath },
          { label: "Refine" },
        ]}
      />

      <div className="post-chat-body">
        <VersionList versions={versions} getPosted={getPosted} onPost={setToPublish} />
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      <div className="chat-input-section">
        {exhausted && !awaitingResponse ? (
          <OutOfDrafts
            limit={usage?.limit}
            next={versions.length > 0 ? "You can still post any version above." : undefined}
          />
        ) : (
          <ChatForm
            onSubmit={handleRefine}
            hint={usage ? costHint(usage, "refine") : null}
            submitLabel="Refine"
            placeholder="Describe how to change the latest version"
            disabled={awaitingResponse || versions.length === 0}
          />
        )}
      </div>

      {toPublish && (
        <PublishDialog draft={toPublish} onClose={() => setToPublish(null)} />
      )}
    </div>
  );
};

export default RefineMessage;
