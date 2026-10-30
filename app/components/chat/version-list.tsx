import DraftCard, { DraftCardSkeleton } from "./draft-card";
import TurnQuestion from "./turn-question";
import { useScrollToLatest } from "~/hooks/useScrollToLatest";
import type { RefineVersion } from "~/hooks/useRefineHistory";
import { postUrl, type PostableDraft, type PostedDraft } from "~/lib/posted-drafts";
import "~/styles/components/version-list.scss";

interface VersionListProps {
  versions: RefineVersion[];
  getPosted: (draft: PostableDraft) => PostedDraft | null;
  onPost: (version: RefineVersion & { content: string }) => void;
}

const versionLabel = (i: number) => (i === 0 ? "Original" : `Version ${i + 1}`);

// Every version of a draft, oldest first; the latest is outlined.
const VersionList = ({ versions, getPosted, onPost }: VersionListProps) => {
  const latestRef = useScrollToLatest<HTMLLIElement>(versions.length);

  if (versions.length === 0) {
    return (
      <p className="version-list-missing" role="status">
        This draft couldn't be found. Go back to the drafts and pick one to refine.
      </p>
    );
  }

  return (
    <ol className="version-list" aria-label="Versions">
      {versions.map((version, i) => {
        const isLatest = i === versions.length - 1;
        const { content } = version;
        const posted = getPosted(version);
        return (
          <li key={version.id} ref={isLatest ? latestRef : undefined} className="version">
            {version.instruction && (
              <TurnQuestion content={version.instruction} askedAt={version.askedAt} />
            )}
            {content === null ? (
              <DraftCardSkeleton />
            ) : (
              <DraftCard
                label={isLatest && i > 0 ? `${versionLabel(i)} · Latest` : versionLabel(i)}
                content={content}
                highlighted={isLatest && versions.length > 1}
                posted={!!posted}
                postedUrl={posted?.postId ? postUrl(posted.postId) : null}
                onPost={() => onPost({ ...version, content })}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default VersionList;
