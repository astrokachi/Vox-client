import { formatMoment } from "~/utils/format-date";
import "~/styles/components/turn-question.scss";

interface TurnQuestionProps {
  content: string;
  // When it was asked (ISO); omitted for requests still being sent.
  askedAt?: string | null;
}

// The prompt that produced the drafts shown beneath it, and when it was asked.
const TurnQuestion = ({ content, askedAt }: TurnQuestionProps) => {
  const when = formatMoment(askedAt ?? undefined);
  return (
    <div className="turn-question-row">
      <p className="turn-question">{content}</p>
      {when && (
        <time className="turn-question-time" dateTime={askedAt ?? undefined}>
          {when}
        </time>
      )}
    </div>
  );
};

export default TurnQuestion;
