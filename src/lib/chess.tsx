import { cn } from "@/utils/cn";
import { ChessBoard, ChessPieces, ChessSettings } from "@/components";
import { useEffect, useRef, useState } from "react";
import { ChessGameContext } from "@/state";
import { CHESS_ACTOR_PERSIST_KEY } from "@/utils/persisted-state";
import { useOnlinePlayer } from "@/utils/online";
import { Loader } from "@/components/ui/loader";
import { Toaster, toast } from "sonner";

function ChessApp() {
  const joinRequest = ChessGameContext.useSelector(
    (c) => c.context.joinRequest
  );
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
    <>
      <Toaster />

      <OnlineGame />

      <Notifications />

      {joinRequest && joinRequest.request === "idle" && (
        <div
          className={cn(
            "fixed z-50 inset-0 backdrop-blur-sm bg-slate-50/10",
            "flex justify-center items-center"
          )}
        >
          <div className="relative">
            <Loader />
          </div>
        </div>
      )}

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
    </>
  );
}

function Notifications() {
  const activePlayer = ChessGameContext.useSelector(
    (c) => c.context.activePlayer
  );
  const selectedHistory = ChessGameContext.useSelector(
    (c) => c.context.selectedHistory
  );

  const turnPlayerColor = selectedHistory?.player;
  const activePlayerColor = activePlayer?.color;

  useEffect(() => {
    if (
      turnPlayerColor &&
      activePlayerColor &&
      activePlayerColor === turnPlayerColor
    ) {
      toast.info("Move your piece");
    }
  }, [turnPlayerColor, activePlayerColor]);

  return <></>;
}

function OnlineGame() {
  useOnlinePlayer();
  return <></>;
}

export default function Chess() {
  return (
    <ChessGameContext.Provider>
      <ChessApp />
    </ChessGameContext.Provider>
  );
}
