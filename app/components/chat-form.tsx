import { SparkleIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from "react";

interface ChatFormProps {
  suggestion?: string;
  refineDraft?: string;
  onClearRefine?: () => void;
  onSubmit?: (content: string) => void;
  promptCount?: number;
  maxPrompts?: number;
  disabled?: boolean;
  submitLabel?: string;
}

// Show only a bit of the draft in the chip.
const previewDraft = (text: string, max = 120) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

export const ChatForm = ({
  suggestion,
  refineDraft,
  onClearRefine,
  onSubmit,
  promptCount = 0,
  maxPrompts = 6,
  disabled = false,
  submitLabel = "Generate post",
}: ChatFormProps) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    const typed = content.trim();
    if (!typed && !refineDraft) return;

    // When refining, send the original draft plus any extra instruction.
    const message = refineDraft
      ? `Refine this draft:\n"${refineDraft}"${typed ? `\n\n${typed}` : ""}`
      : typed;

    onSubmit?.(message);
    setContent("");
    onClearRefine?.();
  };

  // Seed the textarea from a topic suggestion (e.g. trending pills).
  useEffect(() => {
    if (suggestion) setContent(suggestion);
  }, [suggestion]);

  // Focus the input when a draft is brought in to refine.
  useEffect(() => {
    if (refineDraft) textareaRef.current?.focus();
  }, [refineDraft]);

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <div className="textarea-wrapper">
        {refineDraft && (
          <div className="refine-chip">
            <span className="refine-chip-text">{previewDraft(refineDraft)}</span>
            <button
              type="button"
              className="refine-chip-remove"
              onClick={onClearRefine}
              aria-label="Remove draft"
            >
              <XIcon size={14} weight="bold" />
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Enter a topic or describe what you want to talk about"
          value={content}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      <div className="form-footer">
        <span className="prompts-count">{promptCount}/{maxPrompts} prompts</span>
          <button type="submit" className="generate-btn" disabled={disabled}>
            <SparkleIcon size={18} />
            <span>{submitLabel}</span>
          </button>
      </div>
    </form>
  );
};
