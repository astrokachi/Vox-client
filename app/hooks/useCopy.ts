import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const COPIED_MS = 1500;

// Clipboard support never changes while the page is open.
const noSubscribe = () => () => {};
const clipboardSupported = () => window.isSecureContext && !!navigator.clipboard?.writeText;
const notOnServer = () => false;

// Copies text to the clipboard. `copied` is true briefly after a copy works.
// `supported` is false on the server and where the clipboard API isn't
// available (it needs HTTPS or localhost).
export const useCopy = () => {
  const supported = useSyncExternalStore(noSubscribe, clipboardSupported, notOnServer);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  return { copy, copied, supported };
};
