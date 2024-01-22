import { useEffect, useRef } from "react";

export function useScrollToBottom<T extends HTMLElement = HTMLDivElement>(
  deps: any
) {
  const mounted = useRef(false);
  const containerEl = useRef<T>(null);

  useEffect(() => {
    if (containerEl.current) {
      containerEl.current.scrollTo({
        top: containerEl.current.scrollHeight,
        behavior: mounted.current ? "smooth" : "instant",
      });

      mounted.current = true;
    }
  }, [deps]);

  return {
    containerEl,
  };
}
