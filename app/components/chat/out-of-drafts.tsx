import "~/styles/components/out-of-drafts.scss";

interface OutOfDraftsProps {
  // The allowance; omitted while it's unknown.
  limit?: number;
  // What the user can still do, e.g. "You can still post any draft above."
  next?: string;
}

// Replaces the composer once the free drafts are used up.
const OutOfDrafts = ({ limit, next }: OutOfDraftsProps) => (
  <p className="out-of-drafts" role="status">
    <span className="out-of-drafts-title">
      You've used all {limit ? `${limit} ` : ""}free drafts.
    </span>
    {next && <span className="out-of-drafts-next"> {next}</span>}
  </p>
);

export default OutOfDrafts;
