// This is a module worker
import { hasCheckmate, TCheckmateParams } from "@/chess/checkmate";

addEventListener("message", (event: MessageEvent<TCheckmateParams>) => {
  const checkmate = hasCheckmate(event.data);
  postMessage(checkmate);
});
