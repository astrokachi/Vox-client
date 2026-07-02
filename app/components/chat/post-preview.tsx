import { useEffect, useState } from "react";
import {
  CaretLeftIcon,
  CaretRightIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import TypingIndicator from "./typing-indicator";
import PreviewPostModal from "./preview-post-modal";
import type { Message, Turn } from "~/types";

const TONE_LABELS = ["Standard", "Playful", "Educative"];

interface PostPreviewProps {
  turns: Turn[];
  isTyping: boolean;
  user?: { name?: string; username?: string };
  onRefine?: (message: Message) => void;
}

const PostPreview = ({ turns, isTyping, user, onRefine }: PostPreviewProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, Message>>({});

  const total = turns.length;

  // Jump to the newest turn as it arrives.
  useEffect(() => {
    if (total > 0) setActiveIndex(total - 1);
  }, [total]);

  const activeTurn = total > 0 ? turns[Math.min(activeIndex, total - 1)] : null;
  const options = activeTurn?.response.options ?? [];

  // Response is still pending when the active (latest) turn has no options yet.
  const showTyping =
    isTyping &&
    (total === 0 || (activeIndex === total - 1 && options.length === 0));

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(total - 1, i + 1));

  const turnKey = activeTurn?.turnId ?? "";
  const selectedOption = selected[turnKey];

  return (
    <div className="preview-frame">
      <div className="preview-header">
        {total > 0 && (
          <>
            <h2 className="preview-title">Choose your favorite post!</h2>
            <span className="preview-counter">
              {activeIndex + 1} of {total}
            </span>
          </>
        )}
      </div>

      {activeTurn?.question && (
        <div className="turn-question">{activeTurn.question.content}</div>
      )}

      <div className="preview-body">
        {showTyping ? (
          <TypingIndicator />
        ) : activeTurn && options.length > 0 ? (
          <div className="post-options">
            {options.map((message, i) => (
              <button
                key={message.id}
                type="button"
                className={`idea-card${selectedOption?.id === message.id ? " idea-card--selected" : ""}`}
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [turnKey]: message }))
                }
              >
                <span className="idea-card-head">
                  <span className="idea-card-label">
                    {TONE_LABELS[i] ?? `Option ${i + 1}`}
                  </span>
                  <ArrowRightIcon size={18} weight="bold" />
                </span>
                <span className="idea-card-content">{message.content}</span>
              </button>
            ))}
          </div>
        ) : activeTurn ? (
          <TypingIndicator />
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

      {selectedOption && (
        <PreviewPostModal
          content={selectedOption.content}
          displayName={user?.name}
          handle={user?.username ? `@${user.username}` : undefined}
          date={selectedOption.created_at}
          onClose={() => setSelected({})}
          onRefine={(text) => {
            onRefine?.({ ...selectedOption, content: text });
          }}
        />
      )}
    </div>
  );
};

export default PostPreview;
