import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useCopy } from "~/hooks/useCopy";
import "~/styles/components/copy-button.scss";

interface CopyButtonProps {
  text: string;
  label?: string;
}

// Copies `text`; shows "Copied" briefly. Renders nothing where copying can't work.
const CopyButton = ({ text, label = "Copy" }: CopyButtonProps) => {
  const { copy, copied, supported } = useCopy();
  if (!supported) return null;

  return (
    <button
      type="button"
      className={`copy-btn${copied ? " copy-btn--copied" : ""}`}
      onClick={() => copy(text)}
      aria-label={copied ? "Copied" : label}
      title={label}
    >
      {copied ? <CheckIcon size={14} weight="bold" /> : <CopyIcon size={14} />}
      {copied && <span className="copy-btn-text">Copied</span>}
    </button>
  );
};

export default CopyButton;
