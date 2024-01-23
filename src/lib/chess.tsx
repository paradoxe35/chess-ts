import { cn } from "@/utils/cn";
import { ChessBoard, ChessPieces, ChessSettings } from "@/components";
import { useEffect, useRef, useState } from "react";
import { ChessGameContext } from "@/state";
import { CHESS_ACTOR_PERSIST_KEY } from "@/utils/persisted-state";

function ChessApp() {
  const actor = ChessGameContext.useActorRef();
  const [, setValue] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      setValue((t) => t + 1);
    }
  }, []);

  useEffect(() => {
    const subscription = actor.subscribe((ref) => {
      if (ref.context.playId) {
        // Persist machine snapshot
        localStorage.setItem(
          CHESS_ACTOR_PERSIST_KEY(ref.context.playId),
          JSON.stringify(actor.getPersistedSnapshot())
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [actor]);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full px-3 md:px-0 container mx-auto",
        "justify-center items-stretch my-10"
      )}
    >
      <div className="chess-board w-full md:w-1/2">
        <ChessBoard ref={boardRef}>
          {boardRef.current && <ChessPieces boardRef={boardRef} />}
        </ChessBoard>
      </div>

      <div className="chess-settings w-full md:w-1/2 flex flex-col">
        <ChessSettings />
      </div>
    </div>
  );
}

export default function Chess() {
  return (
    <ChessGameContext.Provider>
      <ChessApp />
    </ChessGameContext.Provider>
  );
}
