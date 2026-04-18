import { useState } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/[post]";
import UserMessage from "~/components/chat/user-message";
import AgentResponse from "~/components/chat/agent-response";
import { ChatForm } from "~/components/chat-form";
import "~/styles/dashboard/posts.scss";

interface ChatMessage {
  id: string;
  type: "user" | "agent";
  content: string;
  suggestions?: Array<{
    id: string;
    content: string;
  }>;
}

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;

  // TODO: Replace with actual API call to fetch post
  return { id: id || "" };
}

const Post = () => {
  const { id } = useLoaderData<typeof loader>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "user",
      content: "Generate some post ideas about the impact of AI on creativity",
    },
    {
      id: "2",
      type: "agent",
      content: "Here are some engaging post suggestions:",
      suggestions: [
        {
          id: "s1",
          content: "AI isn't replacing creativity—it's amplifying it. The real creative challenge now is knowing what to ask the machine. The humans who win will be the ones who can collaborate with AI, not compete against it.",
        },
        {
          id: "s2",
          content: "Unpopular opinion: AI tools are the best creative partners we've had since the printing press. They don't take over your vision—they execute your ideas at superhuman speed. The bottleneck was never imagination, it was execution.",
        },
        {
          id: "s3",
          content: "The artists worried about AI are thinking about this wrong. AI is a new medium, just like photography was. Yes, it changed art forever. And yes, entirely new forms of beauty emerged. Same thing is happening now.",
        },
      ],
    },
    {
      id: "3",
      type: "user",
      content: "I like the second one. Can you generate variations with a more technical angle?",
    },
    {
      id: "4",
      type: "agent",
      content: "Here are technical variations on that theme:",
      suggestions: [
        {
          id: "s4",
          content: "LLMs are the first tools where the bottleneck shifted from computation to direction. You can generate infinite outputs, but the constraint is human judgment. This fundamentally changes how we think about creative work—it's now a quality-filtering problem, not a production problem.",
        },
        {
          id: "s5",
          content: "The real innovation isn't the model—it's the interface. Prompt engineering is the new creative skill. Being good at AI means being good at thinking clearly about what you want. That's not replacing skill, that's amplifying clarity.",
        },
        {
          id: "s6",
          content: "Generative AI revealed something surprising: constraints breed creativity. Unlimited computational power didn't make art better—intentional constraints did. The best AI prompts aren't asking for everything, they're asking for something very specific.",
        },
      ],
    },
  ]);
  const [suggestion, setSuggestion] = useState("");

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Mock agent response with post suggestions
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: "Here are some new suggestions:",
        suggestions: [
          {
            id: `s${Date.now()}`,
            content: "This is a generated response based on your input. The AI can create multiple variations to help you find the perfect tone.",
          },
          {
            id: `s${Date.now() + 1}`,
            content: "Each suggestion explores a different angle or perspective on your topic.",
          },
          {
            id: `s${Date.now() + 2}`,
            content: "You can iterate and refine until you find the message that resonates.",
          },
        ],
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 500);
  };

  return (
    <div className="post-chat-container">
      <div className="chat-messages-wrapper">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h2>Generate Post Ideas</h2>
              <p>Start a conversation to get AI-powered post suggestions</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message-group message-${msg.type}`}>
                {msg.type === "user" ? (
                  <UserMessage content={msg.content} />
                ) : (
                  <AgentResponse
                    suggestions={msg.suggestions || []}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-input-section">
        <ChatForm suggestion={suggestion} />
      </div>
    </div>
  );
};

export default Post;
