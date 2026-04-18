import { Form, } from "react-router"
import { SparkleIcon } from "@phosphor-icons/react";
import { useEffect, useState, type ChangeEvent } from "react";

interface ChatFormProps {
  suggestion: string;
}
export const ChatForm = ({ suggestion }: ChatFormProps) => {
  const [content, setContent] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }

  useEffect(() => {
    setContent(suggestion);
  }, [suggestion]);

  return (
    <Form method="post" className="chat-form">
      <div className="textarea-wrapper">
        <textarea
          name="content"
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
    </Form>
  )
}
