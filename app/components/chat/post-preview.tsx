import { useEffect, useState, useMemo } from "react";
import {
  CaretLeftIcon,
  CaretRightIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
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

const PostPreview = ({
  responses,
  isTyping,
  user,
  onRefine,
}: PostPreviewProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, Message>>({});

  // Group messages by message_group_id
  const groups = useMemo(() => {
    const result: Message[][] = [];
    for (const response of responses) {
      const last = result[result.length - 1];
      if (last && last[0].message_group_id === response.message_group_id) {
        last.push(response);
      } else {
        result.push([response]);
      }
    }
    return result;
  }, [responses]);

  const totalGroups = groups.length;

  // Jump to the newest group as it arrives
  useEffect(() => {
    if (totalGroups > 0) setActiveIndex(totalGroups - 1);
  }, [totalGroups]);

  const activeGroup =
    totalGroups > 0 ? groups[Math.min(activeIndex, totalGroups - 1)] : null;

  const showTyping =
    isTyping && (totalGroups === 0 || activeIndex === totalGroups - 1);

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(totalGroups - 1, i + 1));

  // Use the first message's id as the group key for selection tracking
  const groupKey = activeGroup?.[0]?.id ?? "";
  const chosenIndex = selected[groupKey];

  return (
    <div className="preview-frame">
      <div className="preview-header">
        <h2 className="preview-title">Choose your favorite post!</h2>
        {totalGroups > 0 && (
          <span className="preview-counter">
            {activeIndex + 1} of {totalGroups}
          </span>
        )}
      </div>

      <div className="preview-body">
        {showTyping ? (
          <TypingIndicator />
        ) : activeGroup ? (
          <div className="post-options">
            {activeGroup.map((message, i) => (
              <button
                key={message.id}
                type="button"
                className={`idea-card ${selected[groupKey]?.id == message.id ? "--selected" : ""}`}
                onClick={() => {
                  setSelected((prev) => ({ ...prev, [groupKey]: message }));
                }}
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
        ) : (
          <div className="preview-empty">
            <h3>Generate Post Ideas</h3>
            <p>Start a conversation to get AI-powered post suggestions</p>
          </div>
        )}
      </div>

      {totalGroups > 1 && (
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
            {activeIndex + 1} of {totalGroups}
          </span>

          <button
            type="button"
            className="pager"
            onClick={goNext}
            disabled={activeIndex === totalGroups - 1}
          >
            <span>next</span>
            <CaretRightIcon size={18} weight="bold" />
          </button>
        </div>
      )}

      {activeGroup && selected[groupKey] && (
        <PreviewPostModal
          content={selected[groupKey].content}
          displayName={user?.name}
          handle={user?.username ? `@${user.username}` : undefined}
          date={selected[groupKey].created_at}
          onClose={() => setSelected({})}
          onRefine={(text) => {
            onRefine?.(text);
          }}
        />
      )}
    </div>
  );
};

export default PostPreview;
