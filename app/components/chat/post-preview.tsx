import { useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { formatContent } from "~/utils/format-content";
import TypingIndicator from "./typing-indicator";
import PreviewPostModal from "./preview-post-modal";
import type { Message } from "~/types";

const TONE_LABELS = ["Standard", "Playful", "Educative"];
 
interface PostPreviewProps {
  responses: Message[];
  isTyping: boolean;
  user?: { name?: string; username?: string };
  onRefine?: (text: string) => void;
}

const PostPreview = ({ responses, isTyping, user, onRefine }: PostPreviewProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const total = responses.length;

  // Jump to the newest response as it arrives.
  useEffect(() => {
    if (total > 0) setActiveIndex(total - 1);
  }, [total]);

  const active = total > 0 ? responses[Math.min(activeIndex, total - 1)] : undefined;
  const parts = active ? formatContent(active.content, active.type).parts : [];
  const chosen = active ? selected[active.id] : undefined;

  // Show the typing state when a reply for the current (latest) turn is pending.
  const showTyping = isTyping && (total === 0 || activeIndex === total - 1);

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(total - 1, i + 1));
  return (
    <div className="preview-frame">
      <div className="preview-header">
        <h2 className="preview-title">Choose your favorite post!</h2>
        {total > 0 && (
          <span className="preview-counter">
            {Math.min(activeIndex + 1, total)} of {total}
          </span>
        )}
      </div>

      <div className="preview-body">
        {showTyping ? (
          <TypingIndicator />
        ) : active ? (
          <div className="post-options">
            {parts.map((part, i) => (
              <button
                key={i}
                type="button"
                className={`idea-card${chosen === i ? " idea-card--selected" : ""}`}
                onClick={() => {
                  setSelected((prev) => ({ ...prev, [active.id]: i }));
                  setPreviewIndex(i);
                }}
              >
                <span className="idea-card-head">
                  <span className="idea-card-label">
                    {TONE_LABELS[i] ?? `Option ${i + 1}`}
                  </span>
                  <ArrowRightIcon size={18} weight="bold" />
                </span>b
                <span className="idea-card-content">{part}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="preview-empty">
            <h3>Generate Post Ideas</h3>
            <p>Start a conversation to get AI-powered post suggestions</p>
          </div>
        )}
      </div>

      {total > 1 && (
        <div className="preview-pagination">
          <button
            type="button"
            className="pager"
            onClick={goPrev}
            disabled={activeIndex === 0}
          >
            <CaretLeftIcon size={18} weight="bold" />
            <span>prev.</span>
          </button>

          <span className="pager-counter">
            {activeIndex + 1} of {total}
          </span>

          <button
            type="button"
            className="pager"
            onClick={goNext}
            disabled={activeIndex === total - 1}
          >
            <span>next</span>
            <CaretRightIcon size={18} weight="bold" />
          </button>
        </div>
      )}

      {active && previewIndex !== null && parts[previewIndex] !== undefined && (
        <PreviewPostModal
          content={parts[previewIndex]}
          displayName={user?.name}
          handle={user?.username ? `@${user.username}` : undefined}
          date={active.created_at}
          onClose={() => setPreviewIndex(null)}
          onRefine={(text) => {
            onRefine?.(text);
            setPreviewIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default PostPreview;
