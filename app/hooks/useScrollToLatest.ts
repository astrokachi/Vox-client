import { useEffect, useRef } from "react";

// Scrolls the returned ref's element into view whenever `count` grows:
// instantly on first render, smoothly after (unless reduced motion is on).
export const useScrollToLatest = <T extends HTMLElement>(count: number) => {
  const ref = useRef<T>(null);
  const seen = useRef(0);

  useEffect(() => {
    if (count === 0 || count <= seen.current) {
      seen.current = count;
      return;
    }
    const first = seen.current === 0;
    seen.current = count;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollIntoView({
      block: first ? "end" : "start",
      behavior: first || reduce ? "auto" : "smooth",
    });
  }, [count]);

  return ref;
};
