import TypingIndicator from "./typing-indicator";
import "~/styles/dashboard/posts.scss";

interface RefinedOutputCardProps {
  content: string | null;
  isTyping: boolean;
  user?: { name?: string; username?: string };
  onPreview: (text: string) => void;
}

const RefinedOutputCard = ({
  content,
  isTyping,
  user,
  onPreview,
}: RefinedOutputCardProps) => {
  const showTyping = isTyping && content === null;

  return (
    <div className="refined-output-card">
      <div className="refined-output-header">
        <div className="refined-output-user">
          <div className="refined-output-avatar" />
        </div>
        <span className="refined-output-badge">Standard</span>
      </div>

      <div className="refined-output-body">
        {showTyping ? (
          <TypingIndicator />
        ) : content ? (
          <p className="refined-output-text">{content}</p>
        ) : (
          <p className="refined-output-placeholder">
            Your refined post will appear here…
          </p>
        )}
      </div>

      {content && (
        <button
          type="button"
          className="refined-preview-btn"
          onClick={() => onPreview(content)}
        >
          Preview
        </button>
      )}
    </div>
  );
};

export default RefinedOutputCard;
