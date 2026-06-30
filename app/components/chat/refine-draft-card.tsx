import "~/styles/dashboard/posts.scss";

interface RefineDraftCardProps {
  content: string;
}

const RefineDraftCard = ({ content }: RefineDraftCardProps) => {
  return (
    <div className="refine-draft-card">
      <p className="refine-draft-text">{content}</p>
    </div>
  );
};

export default RefineDraftCard;
