import { useLoaderData } from "react-router";
import type { Route } from "./+types";
import "~/styles/dashboard/posts.scss";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;

  // TODO: Replace with actual API call to fetch post
  return {
    id,
    content: "This is a sample post content. Replace with API data.",
    created_at: new Date().toISOString(),
  };
}

const Post = () => {
  const post = useLoaderData<typeof loader>();

  return (
    <div className="post-container">
      <h1>Post: {post.id}</h1>
      <p className="post-content">{post.content}</p>
      <span className="post-date">
        {new Date(post.created_at).toLocaleString()}
      </span>
    </div>
  );
};

export default Post;
