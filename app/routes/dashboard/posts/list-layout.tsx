import { Link, Outlet } from "react-router";
import { PlusIcon } from "@phosphor-icons/react";
import PostsTabs from "~/components/posts/posts-tabs";
import "~/styles/dashboard/posts-list.scss";

// Frame shared by the All and Published tabs.
const PostsLayout = () => (
  <div className="posts-page">
    <header className="posts-header">
      <h1 className="posts-title">Posts</h1>
      <Link className="new-post-btn" to="/posts/new">
        <PlusIcon size={14} weight="bold" />
        New post
      </Link>
    </header>
    <PostsTabs />
    <Outlet />
  </div>
);

export default PostsLayout;
