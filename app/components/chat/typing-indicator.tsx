import { useEffect, useState } from "react";

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

  return <div className="typing-indicator">{PHRASES[index]}…</div>;
};

export default TypingIndicator;
