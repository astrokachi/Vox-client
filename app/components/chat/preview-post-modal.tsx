import { useEffect, useState } from "react";
import {
  XIcon,
  ChatCircleIcon,
  RepeatIcon,
  HeartIcon,
  BookmarkSimpleIcon,
  ShareNetworkIcon,
  ImageIcon,
  CaretDownIcon,
  PencilSimpleLineIcon,
} from "@phosphor-icons/react";

interface PreviewPostModalProps {
  content: string;
  displayName?: string;
  handle?: string;
  date?: string;
  onClose: () => void;
  onPost?: (text: string) => void;
  onRefine?: (text: string) => void;
}

const PreviewPostModal = ({
  content,
  displayName = "Username",
  handle = "@xhandle",
  date,
  onClose,
  onPost,
  onRefine,
}: PreviewPostModalProps) => {
  const [text, setText] = useState(content);

  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div
        className="preview-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview-modal-header">
          <h3>Preview post</h3>
          <button
            type="button"
            className="preview-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon size={24} weight="bold" />
          </button>
        </div>

        <div className="preview-tweet">
          <div className="preview-tweet-user">
            <div className="preview-avatar" />
            <div className="preview-user-meta">
              <span className="preview-username">{displayName}</span>
              <span className="preview-handle">
                {handle}
                {formattedDate ? ` · ${formattedDate}` : ""}
              </span>
            </div>
          </div>

          <textarea
            className="preview-edit-field"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />

          <div className="preview-engagements">
            <div className="preview-engage-group">
              <ChatCircleIcon size={17} />
              <RepeatIcon size={17} />
              <HeartIcon size={17} />
            </div>
            <div className="preview-engage-group">
              <BookmarkSimpleIcon size={17} />
              <ShareNetworkIcon size={17} />
            </div>
          </div>
        </div>

        <div className="preview-modal-footer">
          <button type="button" className="preview-icon-btn" aria-label="Add image">
            <ImageIcon size={24} weight="bold" />
          </button>

          <div className="preview-actions">
            <div className="preview-post-split">
              <button
                type="button"
                className="preview-post-btn"
                onClick={() => onPost?.(text)}
              >
                Post
              </button>
              <button
                type="button"
                className="preview-post-caret"
                aria-label="More post options"
              >
                <CaretDownIcon size={12} weight="bold" />
              </button>
            </div>
            <button
              type="button"
              className="preview-refine-btn"
              onClick={() => onRefine?.(text)}
            >
              Refine <PencilSimpleLineIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPostModal;
