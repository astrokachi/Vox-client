import { Link } from "react-router";
import { CheckIcon } from "@phosphor-icons/react";
import { formatListStamp } from "~/utils/format-date";
import type { DayGroup } from "~/utils/group-by-day";
import type { Conversation } from "~/types";
import { ListGroup } from "./paged-list";
import "~/styles/components/post-list.scss";

interface PostListProps {
  groups: DayGroup<Conversation>[];
}

// Every post, by day. A row opens the post's drafts.
const PostList = ({ groups }: PostListProps) => (
  <>
    {groups.map((group) => (
      <ListGroup key={group.label} label={group.label}>
        {group.items.map((post) => (
          <li key={post.id}>
            <PostRow post={post} />
          </li>
        ))}
      </ListGroup>
    ))}
  </>
);

interface PostRowProps {
  post: Conversation;
}

export const PostRow = ({ post }: PostRowProps) => (
  <Link className="post-row" to={`/posts/${post.id}`}>
    <span className="post-row-title">{post.title}</span>
    <span className="post-row-meta">
      {post.published && (
        <span className="post-row-posted">
          <CheckIcon size={12} weight="bold" aria-hidden="true" />
          Posted
        </span>
      )}
      <time className="post-row-time" dateTime={post.created_at}>
        {formatListStamp(post.created_at)}
      </time>
    </span>
  </Link>
);

export default PostList;
