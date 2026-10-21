import { useEffect, useState } from "react";
import "~/styles/components/typing-indicator.scss";

const PHRASES = [
  "Generating",
  "Constructing",
  "Drafting",
  "Refining",
  "Polishing",
];

const TypingIndicator = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 1500);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="typing-indicator" role="status">
      <span className="typing-indicator-dot" aria-hidden="true" />
      <span className="typing-indicator-text">{PHRASES[index]}…</span>
    </div>
  );
};

export default TypingIndicator;
