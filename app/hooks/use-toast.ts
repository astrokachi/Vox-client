import React from "react";
import { ToastContext, type ToastContextType } from "~/contexts/toast-context";

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
