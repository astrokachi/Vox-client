import { useState } from "react";
import { ChatForm } from "~/components/chat-form";
import OutOfDrafts from "~/components/chat/out-of-drafts";
import { useDraftUsage } from "~/hooks/useDraftUsage";
import { useStartPost } from "~/hooks/useStartPost";
import { costHint } from "~/lib/draft-cost";
import "~/styles/components/start-post-form.scss";

// Starter ideas, not live trends: each fills the composer with a prompt to edit.
const STARTER_IDEAS = [
  "A lesson I learned this week",
  "A tool I can't work without",
  "A hot take on my industry",
  "Behind the scenes of a project",
];

// The first prompt of a new post, with starter ideas to fill it.
const StartPostForm = () => {
  const [suggestion, setSuggestion] = useState("");
  const { start, starting, error } = useStartPost();
  const { usage, exhausted } = useDraftUsage();

  return (
    <div className="start-post">
      <div className="start-post-ideas">
        <span className="start-post-ideas-label" id="start-post-ideas-label">
          Need an idea?
        </span>
        <div className="topic-pills" role="group" aria-labelledby="start-post-ideas-label">
          {STARTER_IDEAS.map((topic) => (
            <button
              key={topic}
              type="button"
              className="topic-pill"
              onClick={() => setSuggestion(`${topic}: `)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      {error && <div className="error-message" role="alert">{error}</div>}
      {exhausted ? (
        <OutOfDrafts
          limit={usage?.limit}
          next="You can still post drafts from your existing posts."
        />
      ) : (
        <ChatForm
          suggestion={suggestion}
          onSubmit={start}
          hint={usage ? costHint(usage, "set") : null}
          submitLabel="Write drafts"
          disabled={starting}
        />
      )}
      {starting && <div className="loading-message" role="status">Creating your post…</div>}
    </div>
  );
};

export default StartPostForm;
