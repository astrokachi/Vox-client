import { useState } from "react";
import { useLoaderData, useLocation } from "react-router";
import type { Route } from "../+types/index";
import PageHeader from "~/components/layouts/page-header";
import VersionList from "~/components/chat/version-list";
import PublishDialog, { type PublishableDraft } from "~/components/chat/publish-dialog";
import { ChatForm } from "~/components/chat-form";
import { useConversationTitle } from "~/hooks/useConversationTitle";
import { usePublishDraft } from "~/hooks/usePublishDraft";
import { useRefineHistory } from "~/hooks/useRefineHistory";
import "~/styles/dashboard/posts.scss";

export async function loader({ params }: Route.LoaderArgs) {
  return { postId: params.id ?? "", messageId: params.messageId ?? "" };
}

const RefineMessage = () => {
  const { postId, messageId } = useLoaderData<typeof loader>();
  const location = useLocation();
  // Draft text handed over from the drafts screen; shown until the original loads.
  const handedOver = (location.state as { draft?: string } | null)?.draft;

  const { title, failed: titleFailed } = useConversationTitle(postId);
  const { versions, awaitingResponse, error, refine } = useRefineHistory(
    postId,
    messageId,
    handedOver,
  );
  const { getPosted } = usePublishDraft();
  const [toPublish, setToPublish] = useState<PublishableDraft | null>(null);

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

      {error && <div className="error-message" role="alert">{error}</div>}

      <div className="chat-input-section">
        <ChatForm
          onSubmit={refine}
          submitLabel="Refine"
          placeholder="Describe how to change the latest version"
          disabled={awaitingResponse || versions.length === 0}
        />
      </div>

      {toPublish && (
        <PublishDialog draft={toPublish} onClose={() => setToPublish(null)} />
      )}
    </div>
  );
};

export default RefineMessage;
