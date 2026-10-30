import { SparkleIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type SubmitEvent } from "react";
import "~/styles/components/chat-form.scss";

interface ChatFormProps {
  suggestion?: string;
  onSubmit?: (content: string) => void;
  /** Line under the field, e.g. what sending will cost; a keyboard tip when omitted. */
  hint?: string | null;
  disabled?: boolean;
  submitLabel?: string;
  placeholder?: string;
}

// Text-only composer for asking the AI for drafts or refinements.
// Images are attached at publish time, not here.
export const ChatForm = ({
  suggestion,
  onSubmit,
  hint,
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

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`chat-form${disabled ? " chat-form--disabled" : ""}${content ? " chat-form--filled" : ""}`}
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
          {hint ?? "Enter to send · Shift+Enter for a new line"}
        </span>
        <button
          type="submit"
          className="generate-btn"
          disabled={disabled || !content.trim()}
        >
          <SparkleIcon size={16} weight="fill" />
          <span className="generate-btn-label">{submitLabel}</span>
        </button>
      </div>
    </form>
  );
};
