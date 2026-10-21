import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowUpRightIcon, CheckCircleIcon, ImageIcon, XIcon } from "@phosphor-icons/react";
import PostImageGrid from "~/components/chat/post-image-grid";
import Spinner from "~/components/spinner";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useImageFiles } from "~/hooks/useImageFiles";
import { usePublishDraft } from "~/hooks/usePublishDraft";
import { postUrl, type PostedDraft } from "~/lib/posted-drafts";
import { formatShortDate } from "~/utils/format-date";
import "~/styles/components/publish-dialog.scss";

// X's limit for standard accounts. Paid accounts can go longer, so this warns
// instead of blocking; X rejects the post if the account can't.
const CHAR_LIMIT = 280;

export interface PublishableDraft {
  id: string;
  content: string;
}

interface PublishDialogProps {
  draft: PublishableDraft;
  onClose: () => void;
}

// The one place a draft is published: edit the text, add images, post, and
// see the result. Every Post button in the app opens this.
const PublishDialog = ({ draft, onClose }: PublishDialogProps) => {
  const user = useCurrentUser();
  const { publish, posting, getPosted } = usePublishDraft();
  const { images, addFiles, removeFile, clearFiles } = useImageFiles();
  const [text, setText] = useState(draft.content);
  const [published, setPublished] = useState<PostedDraft | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previous = getPosted(draft.id);
  const alreadyPosted = !!previous && previous.text === text;
  const charCount = Array.from(text).length;
  const overLimit = charCount > CHAR_LIMIT;
  const canPost = !posting && !alreadyPosted && text.trim().length > 0;

  const close = () => {
    if (!posting) onClose();
  };

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) addFiles(selected);
    e.target.value = "";
  };

  const handlePost = async () => {
    if (!canPost) return;
    const files = images.length > 0 ? images.map((img) => img.file) : undefined;
    const record = await publish(draft.id, text, files);
    if (!record) return;
    clearFiles();
    setPublished(record);
  };

  const viewUrl = (record: PostedDraft | null) =>
    record?.postId ? postUrl(record.postId) : null;

  return (
    <div className="publish-overlay" onClick={close}>
      <div
        ref={dialogRef}
        className="publish-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-dialog-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="publish-header">
          <h3 id="publish-dialog-title" className="publish-title">
            {published ? "Posted" : "Post to X"}
          </h3>
          <button
            type="button"
            className="publish-close"
            onClick={close}
            disabled={posting}
            aria-label="Close"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {published ? (
          <div className="publish-success" role="status">
            <CheckCircleIcon className="publish-success-icon" size={32} weight="fill" />
            <p className="publish-success-text">Your post is live on X.</p>
            <div className="publish-success-actions">
              {viewUrl(published) && (
                <a
                  className="publish-view-btn"
                  href={viewUrl(published) as string}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on X
                  <ArrowUpRightIcon size={12} weight="bold" />
                </a>
              )}
              <button type="button" className="publish-post-btn" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="publish-preview">
              <div className="publish-user">
                {user?.profile_img_url ? (
                  <img className="publish-avatar" src={user.profile_img_url} alt="" />
                ) : (
                  <div className="publish-avatar" />
                )}
                <div className="publish-user-meta">
                  <span className="publish-name">{user?.name ?? "You"}</span>
                  <span className="publish-handle">
                    {user?.username ? `@${user.username} · ` : ""}
                    {formatShortDate(new Date().toISOString())}
                  </span>
                </div>
              </div>

              <textarea
                className="publish-text"
                aria-label="Post text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
              />

              <PostImageGrid images={images} onRemove={removeFile} />
            </div>

            <div className="publish-footer">
              <button
                type="button"
                className="publish-image-btn"
                aria-label="Add images"
                title="Add images"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFileChange}
              />

              <span
                className={`publish-count${overLimit ? " publish-count--over" : ""}`}
                aria-live="polite"
              >
                {charCount} / {CHAR_LIMIT}
                {overLimit && " · Over limit"}
              </span>

              {alreadyPosted && viewUrl(previous) ? (
                <a
                  className="publish-view-btn"
                  href={viewUrl(previous) as string}
                  target="_blank"
                  rel="noreferrer"
                >
                  Posted · View on X
                  <ArrowUpRightIcon size={12} weight="bold" />
                </a>
              ) : (
                <button
                  type="button"
                  className="publish-post-btn"
                  disabled={!canPost}
                  onClick={handlePost}
                >
                  {posting ? <Spinner /> : alreadyPosted ? "Posted" : "Post"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublishDialog;
