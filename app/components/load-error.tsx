import { WarningCircleIcon } from "@phosphor-icons/react";
import "~/styles/components/load-error.scss";

interface LoadErrorProps {
  message: string;
  onRetry: () => void;
}

// Stands in for content that failed to load, with a way to try again.
const LoadError = ({ message, onRetry }: LoadErrorProps) => (
  <div className="load-error" role="alert">
    <WarningCircleIcon size={16} className="load-error-icon" />
    <span className="load-error-text">{message}</span>
    <button type="button" className="load-error-retry" onClick={onRetry}>
      Try again
    </button>
  </div>
);

export default LoadError;
