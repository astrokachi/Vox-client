import { SparkleIcon } from "@phosphor-icons/react";
import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";

interface ChatFormProps {
  suggestion?: string;
  onSubmit?: (content: string) => void;
}

export const ChatForm = ({ suggestion, onSubmit }: ChatFormProps) => {
  const [content, setContent] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        />
      </div>
      <div className="form-footer">
        <span className="prompts-count">{0}/{6} prompts</span>
        <button type="submit" className="generate-btn">
          <SparkleIcon size={18} />
          Generate post
        </button>
      </div>
    </form>
  );
};
