import { useState } from "react";
import { ArrowLeftIcon, CaretDownIcon } from "@phosphor-icons/react";
import "~/styles/dashboard/posts.scss";

interface HistoryItem {
  id: string;
  content: string;
}

interface RefineHeaderProps {
  onBack: () => void;
  history?: HistoryItem[];
  onSelectHistory?: (item: HistoryItem) => void;
}

const previewText = (text: string, max = 80) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

const RefineHeader = ({ onBack, history, onSelectHistory }: RefineHeaderProps) => {
  const [open, setOpen] = useState(false);

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

      {history && history.length > 0 && (
        <div className="refine-history-wrapper">
          <button
            type="button"
            className="refine-history-btn"
            onClick={() => setOpen((p) => !p)}
          >
            History ({history.length})
            <CaretDownIcon size={14} weight="bold" />
          </button>

          {open && (
            <>
              <div
                className="refine-history-overlay"
                onClick={() => setOpen(false)}
              />
              <div className="refine-history-dropdown">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="refine-history-item"
                    onClick={() => {
                      onSelectHistory?.(item);
                      setOpen(false);
                    }}
                  >
                    {previewText(item.content)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RefineHeader;
