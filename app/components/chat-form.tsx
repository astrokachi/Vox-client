import { SparkleIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type SubmitEvent } from "react";
import "~/styles/components/chat-form.scss";

interface ChatFormProps {
  suggestion?: string;
  onSubmit?: (content: string) => void;
  promptCount?: number;
  /** When omitted, no "left" count is shown (no limit). */
  maxPrompts?: number;
  disabled?: boolean;
  submitLabel?: string;
  placeholder?: string;
}

// Text-only composer for asking the AI for drafts or refinements.
// Images are attached at publish time, not here.
export const ChatForm = ({
  suggestion,
  onSubmit,
  promptCount = 0,
  maxPrompts,
  disabled = false,
  submitLabel = "Write drafts",
  placeholder = "Describe a topic or what you want to say",
}: ChatFormProps) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    const typed = content.trim();
    if (!typed) return;

    onSubmit?.(typed);
    setContent("");
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [content]);

  useEffect(() => {
    if (suggestion) {
      setContent(suggestion);
      const el = textareaRef.current;
      el?.focus();
      el?.setSelectionRange(suggestion.length, suggestion.length);
    }
  }, [suggestion]);

  const remaining = maxPrompts !== undefined ? Math.max(maxPrompts - promptCount, 0) : null;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`chat-form${disabled ? " chat-form--disabled" : ""}`}
    >
      <textarea
        ref={textareaRef}
        className="chat-textarea"
        aria-label={placeholder}
        placeholder={placeholder}
        rows={1}
        value={content}
        onChange={handleChange}
        onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
        disabled={disabled}
      />
      <div className="form-footer">
        <span className="form-hint">
          {remaining !== null
            ? `${remaining} of ${maxPrompts} left`
            : "Enter to send · Shift+Enter for a new line"}
        </span>
        <button
          type="submit"
          className="generate-btn"
          disabled={disabled || !content.trim()}
        >
          <SparkleIcon size={16} weight="fill" />
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
};
