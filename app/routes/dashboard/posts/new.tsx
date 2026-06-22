import { useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router";
import type { clientLoader as dashboardLoader } from '~/routes/dashboard/index';
import "~/styles/dashboard/posts.scss";
import { ChatForm } from "~/components/chat-form";
import { chatApi } from "~/api/endpoints";

const TRENDING_TOPICS = [
  "Trump's statement",
  "Design and AI",
  "Freelancing on Upwork",
  "#30dayschallenge",
];

const NewPost = () => {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dashboardData = useRouteLoaderData<typeof dashboardLoader>('routes/dashboard/index');
  const user = dashboardData?.user;

  const handleTopicClick = (topic: string) => {
    setSuggestion(`Create a new x post on ${topic}`);
  };

  const handleFormSubmit = async (content: string) => {
    setLoading(true);
    setError(null);
    try {
      const conversation = await chatApi.createWithPrompt({
        payload: { content, type: "MULTIPLE" },
      });
      navigate(`/posts/${conversation.id}`);
    } catch {
      setError("Failed to create conversation");
    } finally {
      setLoading(false);
    }
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
        {error && <div className="error-message">{error}</div>}
        <ChatForm suggestion={suggestion} onSubmit={handleFormSubmit} />
        {loading && <div className="loading-message">Creating conversation...</div>}
      </div>
    </div>
  );
};

export default NewPost;
