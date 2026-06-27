import { ArrowLeftIcon, CaretDownIcon } from "@phosphor-icons/react";
import "~/styles/dashboard/posts.scss";

interface RefineHeaderProps {
  onBack: () => void;
}

const RefineHeader = ({ onBack }: RefineHeaderProps) => {
  return (
    <div className="refine-header">
      <div className="refine-header-left">
        <button
          type="button"
          className="refine-back-btn"
          onClick={onBack}
          aria-label="Back to post options"
        >
          <ArrowLeftIcon size={18} weight="bold" />
        </button>
        <span className="refine-header-title">Refine Mode</span>
      </div>

      <button type="button" className="refine-history-btn">
        History
        <CaretDownIcon size={14} weight="bold" />
      </button>
    </div>
  );
};

export default RefineHeader;
