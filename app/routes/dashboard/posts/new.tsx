import { useState } from "react";
import { redirect, useRouteLoaderData } from "react-router";
import type { Route } from "./+types";
import type { loader as dashboardLoader } from '~/routes/dashboard/index';
import "~/styles/dashboard/posts.scss";
import { ChatForm } from "~/components/chat-form";

const TRENDING_TOPICS = [
  "Trump's statement",
  "Design and AI",
  "Freelancing on Upwork",
  "#30dayschallenge",
];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const content = formData.get("content");

  if (!content || typeof content !== "string" || content.trim() === "") {
    return { error: "Content is required" };
  }

  const postId = crypto.randomUUID();

  return redirect(`/posts/${postId}`);
}

const NewPost = () => {
  const [suggestion, setSuggestion] = useState("");
  const data = useRouteLoaderData<typeof dashboardLoader>('routes/dashboard/index');
  const user = data?.user ?? null;

  const handleTopicClick = (topic: string) => {
    setSuggestion(`Create a new x post on ${topic}`);
  };

  return (
    <div className="chat-container">
      <div className="greeting-section">
        <div className="logo-gradient" />
        <p className="greeting-text">Hi, {user?.name}</p>
        <h2 className="greeting-heading">What would you like to tweet about?</h2>
      </div>

      <div className="input-section">
        <div className="trending-section">
          <span className="trending-label">Try these trending X topics</span>
          <div className="topic-pills">
            {TRENDING_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                className="topic-pill"
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
        <ChatForm suggestion={suggestion} />
      </div>
    </div>
  );
};

export default NewPost;
