import { ArrowUpRightIcon, CheckIcon, PencilSimpleLineIcon } from "@phosphor-icons/react";
import CopyButton from "~/components/copy-button";
import { X_CHAR_LIMIT, xLength } from "~/lib/x-length";
import "~/styles/components/draft-card.scss";

interface DraftCardProps {
  label: string;
  content: string;
  // Accent outline for the version that matters most (e.g. the latest refine).
  highlighted?: boolean;
  posted?: boolean;
  // Link to the published post; only set when X returned its id.
  postedUrl?: string | null;
  onRefine?: () => void;
  onPost: () => void;
}

interface DraftLengthProps {
  content: string;
}

// The draft's length as X counts it; flagged once it won't fit.
const DraftLength = ({ content }: DraftLengthProps) => {
  const length = xLength(content);
  const over = length > X_CHAR_LIMIT;
  return (
    <span
      className={`draft-card-length${over ? " draft-card-length--over" : ""}`}
      title={`${length} of ${X_CHAR_LIMIT} characters`}
    >
      {length}
      {over && " · Too long"}
    </span>
  );
};

// One draft with its own actions. Once posted, Post gives way to a link.
const DraftCard = ({
  label,
  content,
  highlighted = false,
  posted = false,
  postedUrl,
  onRefine,
  onPost,
}: DraftCardProps) => (
  <article className={`draft-card${highlighted ? " draft-card--highlighted" : ""}`}>
    <header className="draft-card-head">
      <span className="draft-card-label">{label}</span>
      <span className="draft-card-meta">
        {posted && (
          <span className="draft-card-posted">
            <CheckIcon size={12} weight="bold" />
            Posted
          </span>
        )}
        <CopyButton text={content} label="Copy draft" />
      </span>
    </header>

    <p className="draft-card-content">{content}</p>

    <footer className="draft-card-actions">
      <DraftLength content={content} />
      {onRefine && (
        <button type="button" className="draft-card-refine" onClick={onRefine}>
          <PencilSimpleLineIcon size={14} />
          Refine
        </button>
      )}
      {!posted ? (
        <button type="button" className="draft-card-post" onClick={onPost} aria-haspopup="dialog">
          Post
        </button>
      ) : (
        postedUrl && (
          <a className="draft-card-view" href={postedUrl} target="_blank" rel="noreferrer">
            View on X
            <ArrowUpRightIcon size={12} weight="bold" />
          </a>
        )
      )}
    </footer>
  </article>
);

// Placeholder with the same footprint while a draft is being written.
export const DraftCardSkeleton = () => (
  <div className="draft-card draft-card--skeleton" aria-hidden="true">
    <span className="draft-card-skeleton-line draft-card-skeleton-line--short" />
    <span className="draft-card-skeleton-line" />
    <span className="draft-card-skeleton-line" />
    <span className="draft-card-skeleton-line draft-card-skeleton-line--mid" />
  </div>
);

export default DraftCard;
