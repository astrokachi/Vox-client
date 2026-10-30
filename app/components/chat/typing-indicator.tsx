import "~/styles/components/typing-indicator.scss";

interface TypingIndicatorProps {
  label?: string;
}

// A pulsing dot and a steady line saying what's being written.
const TypingIndicator = ({ label = "Writing drafts…" }: TypingIndicatorProps) => (
  <div className="typing-indicator" role="status">
    <span className="typing-indicator-dot" aria-hidden="true" />
    <span className="typing-indicator-text">{label}</span>
  </div>
);

export default TypingIndicator;
