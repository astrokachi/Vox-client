import "~/styles/components/turn-question.scss";

interface TurnQuestionProps {
  content: string;
}

// The prompt that produced the drafts shown beneath it.
const TurnQuestion = ({ content }: TurnQuestionProps) => (
  <p className="turn-question">{content}</p>
);

export default TurnQuestion;
