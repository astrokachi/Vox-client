import { useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router";
import type { loader as dashboardLoader } from '~/routes/dashboard/index';
import "~/styles/dashboard/posts.scss";
import { ChatForm } from "~/components/chat-form";
import { useApiCall } from "~/hooks/useApiCall";
import { chatApi } from "~/api/endpoints";
import type { ChatCreateWithPromptDto, ChatsResponse } from "~/types";
// import { socket } from "~/services/socket";

const TRENDING_TOPICS = [
  "Trump's statement",
  "Design and AI",
  "Freelancing on Upwork",
  "#30dayschallenge",
];

const NewPost = () => {
  const [suggestion, setSuggestion] = useState("");
  const navigate = useNavigate();
  const dashboardData = useRouteLoaderData<typeof dashboardLoader>('routes/dashboard/index');
  const user = dashboardData?.user;
  const { execute, data, loading, error } = useApiCall<ChatCreateWithPromptDto, ChatsResponse>(chatApi.createWithPrompt);


  const handleTopicClick = (topic: string) => {
    setSuggestion(`Create a new x post on ${topic}`);
  };

  const handleFormSubmit = async (content: string) => {
    await execute({ payload: { content, type: "MULTIPLE" } });
    if (!error) navigate(`/${data?.id}`);
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
        {error && <div className="error-message">{error.message}</div>}
        <ChatForm suggestion={suggestion} onSubmit={handleFormSubmit} />
        {loading && <div className="loading-message">Creating conversation...</div>}
      </div>
    </div>
  );
};

export default NewPost;
