import React from "react";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@phosphor-icons/react";
import { useToast } from "~/hooks/use-toast";
import "~/styles/components/toast.scss";

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
} as const;

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <Icon className="toast-icon" size={20} weight="fill" />
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <XIcon size={14} weight="bold" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
