import { HeartIcon, ChatCircleIcon, ShareIcon } from "@phosphor-icons/react";

interface PostSuggestion {
  id: string;
  content: string;
  avatar?: string;
  author?: string;
}
//
// interface AgentResponseProps {
//   suggestions: PostSuggestion[];
// }

const AgentResponse = ({ content }: PostSuggestion) => {
  return (
    <div className="agent-response">
      <div className="suggestions-container">
        {/* {suggestions.map((suggestion) => ( */}
        <div className="post-card">
          <div className="post-header">
            <div className="avatar-wrapper">
              <div className="avatar-gradient" />
            </div>
            <button className="menu-btn">⋯</button>
          </div>

          <div className="post-content">
            {content}
          </div>

          <div className="post-footer">
            <button className="engagement-btn">
              <ChatCircleIcon size={16} />
              <span>0</span>
            </button>
            <button className="engagement-btn">
              <HeartIcon size={16} />
              <span>0</span>
            </button>
            <button className="engagement-btn">
              <ShareIcon size={16} />
            </button>
          </div>
        </div>

        {/* ))} */}
      </div>
    </div>
  );
};

export default AgentResponse;
