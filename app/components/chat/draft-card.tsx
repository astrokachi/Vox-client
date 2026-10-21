import { ArrowUpRightIcon, CheckIcon, PencilSimpleLineIcon } from "@phosphor-icons/react";
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
      {posted && (
        <span className="draft-card-posted">
          <CheckIcon size={12} weight="bold" />
          Posted
        </span>
      )}
    </header>

    <p className="draft-card-content">{content}</p>

    <footer className="draft-card-actions">
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
