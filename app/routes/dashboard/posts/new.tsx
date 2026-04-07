import { Form, redirect } from "react-router";
import type { Route } from "./+types";
import "~/styles/dashboard/posts.scss";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const content = formData.get("content");

  if (!content || typeof content !== "string" || content.trim() === "") {
    return { error: "Content is required" };
  }

  // TODO: Replace with actual API call to create post
  const postId = crypto.randomUUID();

  return redirect(`/posts/${postId}`);
}

const NewPost = () => {
  return (
    <div className="new-post-container">
      <h1>New Post</h1>
      <Form method="post" className="new-post-form">
      </Form>
    </div>
  );
};

export default NewPost;
