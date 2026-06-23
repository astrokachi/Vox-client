import { SparkleIcon } from "@phosphor-icons/react";
import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";

interface ChatFormProps {
  suggestion?: string;
  onSubmit?: (content: string) => void;
  promptCount?: number;
  maxPrompts?: number;
  disabled?: boolean;
}

export const ChatForm = ({
  suggestion,
  onSubmit,
  promptCount = 0,
  maxPrompts = 6,
  disabled = false,
}: ChatFormProps) => {
  const [content, setContent] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    if (content.trim() && onSubmit) {
      onSubmit(content);
      setContent("");
    }
  };

  useEffect(() => {
    function setSuggestion() {
      if (suggestion) {
        setContent(suggestion);
      }
    }

    setSuggestion();
  }, [suggestion]);

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <div className="textarea-wrapper">
        <textarea
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
          Generate post
        </button>
      </div>
    </form>
  );
};
