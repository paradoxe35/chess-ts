import { useEffect, useRef } from "react";

function Checkmate() {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL("./checkmate.ts", import.meta.url));
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return <></>;
}

export function Workers() {
  return (
    <>
      <Checkmate />
    </>
  );
}
