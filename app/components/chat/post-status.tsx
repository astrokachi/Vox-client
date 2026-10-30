import { ArrowUpRightIcon, CheckIcon } from "@phosphor-icons/react";
import { formatMoment } from "~/utils/format-date";
import "~/styles/components/post-status.scss";

interface PostStatusProps {
  publishedAt: string;
  // Link to the post on X; omitted when X didn't return its id.
  url?: string | null;
}

// Says the post went out, and when: "✓ Published 10:48 PM · View on X".
const PostStatus = ({ publishedAt, url }: PostStatusProps) => (
  <p className="post-status" role="status">
    <CheckIcon size={12} weight="bold" className="post-status-icon" />
    <span>
      Published <time dateTime={publishedAt}>{formatMoment(publishedAt)}</time>
    </span>
    {url && (
      <>
        <span aria-hidden="true">·</span>
        <a className="post-status-link" href={url} target="_blank" rel="noreferrer">
          View on X
          <ArrowUpRightIcon size={12} weight="bold" />
        </a>
      </>
    )}
  </p>
);

export default PostStatus;
