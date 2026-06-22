import { HeartIcon, ChatCircleIcon, ShareIcon } from "@phosphor-icons/react";
import { formatContent } from "~/utils/format-content";

interface AgentResponseProps {
  id: string;
  content: string;
  type?: string;
}

const AgentResponse = ({ content, type }: AgentResponseProps) => {
  const { parts } = formatContent(content, type);

  return (
    <div className="agent-response">
      <div className="suggestions-container">
        {parts.map((part, i) => (
          <div key={i} className="post-card">
            <div className="post-header">
              <div className="avatar-wrapper">
                <div className="avatar-gradient" />
              </div>
              <button className="menu-btn">⋯</button>
            </div>

            <div className="post-content">
              {part}
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
        ))}
      </div>
    </div>
  );
};

export default AgentResponse;
