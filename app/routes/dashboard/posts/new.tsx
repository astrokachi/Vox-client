import { useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router";
import type { clientLoader as dashboardLoader } from '~/routes/dashboard/index';
import "~/styles/dashboard/posts.scss";
import { ChatForm } from "~/components/chat-form";
import { chatApi } from "~/api/endpoints";

const logo = "/vox-small.png";

// Starter ideas, not live trends: each fills the composer with a prompt to edit.
const STARTER_IDEAS = [
  "A lesson I learned this week",
  "A tool I can't work without",
  "A hot take on my industry",
  "Behind the scenes of a project",
];

const NewPost = () => {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dashboardData = useRouteLoaderData<typeof dashboardLoader>('routes/dashboard/index');
  const user = dashboardData?.user;

  const handleTopicClick = (topic: string) => {
    setSuggestion(`${topic}: `);
  };

  const handleFormSubmit = async (_content: string) => {
    setLoading(true);
    setError(null);
    try {
      const conversation = await chatApi.createWithPrompt({
        payload: { content: _content, type: "MULTIPLE" },
      });
      navigate(`/posts/${conversation.id}`);
    } catch {
      setError("Couldn't start this post. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="greeting-section">
        <img className="greeting-logo" src={logo} alt="" />
        {user?.name && <p className="greeting-text">Hi, {user.name}</p>}
        <h2 className="greeting-heading">What do you want to post about?</h2>
      </div>

      <div className="input-section">
        <div className="trending-section">
          <span className="trending-label" id="trending-label">Need an idea?</span>
          <div className="topic-pills" role="group" aria-labelledby="trending-label">
            {STARTER_IDEAS.map((topic) => (
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
        {error && <div className="error-message" role="alert">{error}</div>}
        <ChatForm
          suggestion={suggestion}
          onSubmit={handleFormSubmit}
          submitLabel="Write drafts"
          disabled={loading}
        />
        {loading && <div className="loading-message" role="status">Creating your post…</div>}
      </div>
    </div>
  );
};

export default NewPost;
