import type { ReactNode } from "react";
import LoadError from "~/components/load-error";
import Spinner from "~/components/spinner";
import type { CursorList } from "~/hooks/useCursorList";
import "~/styles/components/paged-list.scss";

const SKELETON_ROWS = 5;

interface PagedListProps {
  list: CursorList<unknown>;
  // What is loading, for screen readers ("Loading posts").
  loadingLabel: string;
  // What "load more" fetches ("older posts").
  moreLabel: string;
  empty: ReactNode;
  children: ReactNode;
}

// The states every paged list goes through: loading, failed, empty, then the
// list itself with a button for the next page.
const PagedList = ({ list, loadingLabel, moreLabel, empty, children }: PagedListProps) => {
  if (list.loading) return <ListSkeleton label={loadingLabel} />;
  if (list.error) return <LoadError message={list.error} onRetry={list.retry} />;
  if (list.items.length === 0) return <>{empty}</>;

  return (
    <div className="paged-list">
      {children}
      {list.hasMore && (
        <div className="paged-list-more">
          <button
            type="button"
            className="paged-list-more-btn"
            onClick={list.loadMore}
            disabled={list.loadingMore}
          >
            {list.loadingMore ? <Spinner /> : `Show ${moreLabel}`}
          </button>
          {list.loadMoreError && (
            <p className="paged-list-more-error" role="alert">
              {list.loadMoreError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface ListGroupProps {
  label: string;
  children: ReactNode;
}

// One day's rows under its label ("Today").
export const ListGroup = ({ label, children }: ListGroupProps) => (
  <section className="list-group" aria-label={label}>
    <h2 className="list-group-label">{label}</h2>
    <ul className="list-group-items">{children}</ul>
  </section>
);

interface ListEmptyProps {
  title: string;
  hint: string;
  children?: ReactNode;
}

export const ListEmpty = ({ title, hint, children }: ListEmptyProps) => (
  <div className="list-empty">
    <h2 className="list-empty-title">{title}</h2>
    <p className="list-empty-hint">{hint}</p>
    {children}
  </div>
);

const ListSkeleton = ({ label }: { label: string }) => (
  <div className="list-group" aria-busy="true" aria-label={label}>
    <span className="list-skeleton-label" />
    <ul className="list-group-items">
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <li key={i} className="list-skeleton-row">
          <span className="list-skeleton-line" />
        </li>
      ))}
    </ul>
  </div>
);

export default PagedList;
