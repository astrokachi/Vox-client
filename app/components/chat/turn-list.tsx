import { WarningCircleIcon } from "@phosphor-icons/react";
import DraftCard, { DraftCardSkeleton } from "./draft-card";
import TurnQuestion from "./turn-question";
import TypingIndicator from "./typing-indicator";
import { useScrollToLatest } from "~/hooks/useScrollToLatest";
import { postUrl, type PostableDraft, type PostedDraft } from "~/lib/posted-drafts";
import type { Message, Turn } from "~/types";
import "~/styles/components/turn-list.scss";

// The server writes drafts in this tone order (DRAFT_TONES in x-bot's const.ts).
const TONE_LABELS = ["Standard", "Playful", "Educative"];

const toneLabel = (i: number) => TONE_LABELS[i] ?? `Option ${i + 1}`;

interface TurnListProps {
  turns: Turn[];
  // Turns whose drafts are still being written; other empty turns failed.
  pendingTurnIds: ReadonlySet<string>;
  isTyping: boolean;
  // False once the post is out of prompts (a retry uses one).
  canRetry: boolean;
  getPosted: (draft: PostableDraft) => PostedDraft | null;
  onRefine: (draft: Message) => void;
  onPost: (draft: Message) => void;
  onRetry: (turn: Turn) => void;
}

const PendingDrafts = () => (
  <>
    <TypingIndicator />
    <div className="turn-drafts">
      {TONE_LABELS.map((label) => (
        <DraftCardSkeleton key={label} />
      ))}
    </div>
  </>
);

interface FailedDraftsProps {
  onRetry?: () => void;
}

const FailedDrafts = ({ onRetry }: FailedDraftsProps) => (
  <div className="turn-failed" role="status">
    <WarningCircleIcon size={16} className="turn-failed-icon" />
    <span className="turn-failed-text">Couldn't generate drafts.</span>
    {onRetry && (
      <button type="button" className="turn-failed-retry" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

// Every prompt in a post, oldest first, each followed by its drafts.
const TurnList = ({
  turns,
  pendingTurnIds,
  isTyping,
  canRetry,
  getPosted,
  onRefine,
  onPost,
  onRetry,
}: TurnListProps) => {
  const latestRef = useScrollToLatest<HTMLElement>(turns.length);

  if (turns.length === 0) {
    return isTyping ? (
      <section className="turn" aria-label="Writing drafts">
        <PendingDrafts />
      </section>
    ) : (
      <section className="turn-list-empty">
        <h2 className="turn-list-empty-title">No drafts yet</h2>
        <p className="turn-list-empty-hint">
          Describe a topic below to get three drafts to choose from.
        </p>
      </section>
    );
  }

  return (
    <div className="turn-list">
      {turns.map((turn, t) => {
        const isLatest = t === turns.length - 1;
        const options = turn.response.options;
        return (
          <section
            key={turn.turnId}
            ref={isLatest ? latestRef : undefined}
            className="turn"
            aria-label={turn.question ? `Drafts for: ${turn.question.content}` : "Drafts"}
          >
            {turn.question && (
              <TurnQuestion
                content={turn.question.content}
                askedAt={turn.question.created_at}
              />
            )}

            {options.length === 0 && pendingTurnIds.has(turn.turnId) ? (
              <PendingDrafts />
            ) : options.length === 0 ? (
              <FailedDrafts
                onRetry={canRetry && turn.question ? () => onRetry(turn) : undefined}
              />
            ) : (
              <div className="turn-drafts">
                {options.map((message, i) => {
                  const posted = getPosted(message);
                  return (
                    <DraftCard
                      key={message.id}
                      label={toneLabel(i)}
                      content={message.content}
                      posted={!!posted}
                      postedUrl={posted?.postId ? postUrl(posted.postId) : null}
                      onRefine={() => onRefine(message)}
                      onPost={() => onPost(message)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

// Shown while a post's history loads; matches one loaded turn.
export const TurnListSkeleton = () => (
  <div className="turn-list" aria-busy="true" aria-label="Loading drafts">
    <section className="turn">
      <span className="turn-skeleton-question" />
      <div className="turn-drafts">
        {TONE_LABELS.map((label) => (
          <DraftCardSkeleton key={label} />
        ))}
      </div>
    </section>
  </div>
);

export default TurnList;
