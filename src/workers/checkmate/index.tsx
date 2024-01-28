import { TCheckmate, TCheckmateParams } from "@/chess/checkmate";
import { useEffect } from "react";

const WORKER: { v?: Worker } = {};

export async function requestForCheckmate(
  params: TCheckmateParams
): Promise<TCheckmate> {
  return new Promise((resolve, reject) => {
    if (!WORKER.v) {
      return reject("No worker found!");
    }

    WORKER.v.addEventListener("error", reject, { once: true });
    WORKER.v.addEventListener("messageerror", reject, { once: true });

    const onMessage = (event: MessageEvent<TCheckmate>) => {
      resolve(event.data);
      WORKER.v?.removeEventListener("message", onMessage);
    };

    WORKER.v.addEventListener("message", onMessage, { once: true });

    // post request
    WORKER.v.postMessage(params);
  });
}

export function CheckmateWorker() {
  useEffect(() => {
    WORKER.v = new Worker(new URL("./checkmate.ts", import.meta.url));
    return () => {
      WORKER.v?.terminate();
    };
  }, []);

  return <></>;
}
