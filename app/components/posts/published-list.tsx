import { Link } from "react-router";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { postUrl } from "~/lib/posted-drafts";
import { formatListStamp } from "~/utils/format-date";
import type { DayGroup } from "~/utils/group-by-day";
import type { SentPost } from "~/types";
import { ListGroup } from "./paged-list";
import "~/styles/components/published-list.scss";

interface PublishedListProps {
  groups: DayGroup<SentPost>[];
}

// Posts that went out to X, by day, shown as they were posted.
const PublishedList = ({ groups }: PublishedListProps) => (
  <>
    {groups.map((group) => (
      <ListGroup key={group.label} label={group.label}>
        {group.items.map((post) => (
          <li key={post.id}>
            <PublishedItem post={post} />
          </li>
        ))}
      </ListGroup>
    ))}
  </>
);

interface PublishedItemProps {
  post: SentPost;
}

// The posted text, when it went out and from which post, with the two places
// to go from here: back to the drafts, or out to X.
export const PublishedItem = ({ post }: PublishedItemProps) => (
  <article className="published-item">
    <p className="published-item-text">{post.content}</p>
    <footer className="published-item-footer">
      <p className="published-item-context">
        <time dateTime={post.published_at}>{formatListStamp(post.published_at)}</time>
        {post.conversation_title && (
          <span className="published-item-source">{post.conversation_title}</span>
        )}
      </p>
      <div className="published-item-actions">
        {post.conversation_id && (
          <Link className="published-item-action" to={`/posts/${post.conversation_id}`}>
            Open drafts
          </Link>
        )}
        {post.x_post_id && (
          <a
            className="published-item-action published-item-action--x"
            href={postUrl(post.x_post_id)}
            target="_blank"
            rel="noreferrer"
          >
            View on X
            <ArrowUpRightIcon size={12} weight="bold" aria-hidden="true" />
          </a>
        )}
      </div>
    </footer>
  </article>
);

export default PublishedList;
