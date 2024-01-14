import { useEffect, useRef } from "react";
import { Players } from "./components/players";

export function Points() {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Players />

      <ShowPoints />
    </div>
  );
}

function ShowPoints() {
  const mounted = useRef(false);
  const containerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerEl.current) {
      containerEl.current.scrollTo({
        top: containerEl.current.scrollHeight,
        behavior: mounted.current ? "smooth" : "instant",
      });

      mounted.current = true;
    }
  }, [history.length]);

  return (
    <div
      ref={containerEl}
      className="w-full flex justify-between max-h-96 overflow-y-auto no-scrollbar"
    ></div>
  );
}
