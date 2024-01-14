import React, { useEffect, useRef } from "react";
import { ChessGameContext, GHistory, TLastMoves } from "@/state";
import { cn } from "@/utils/cn";
import { PieceImg } from "@/components/ui/piece";
import { Players } from "./components/players";

export function Overview() {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Players />

      <ShowHistories />
    </div>
  );
}

function ShowHistories() {
  const mounted = useRef(false);
  const containerEl = useRef<HTMLDivElement>(null);
  const players = ChessGameContext.useSelector((c) => c.context.players);
  const lastMoves = ChessGameContext.useSelector((c) => c.context.lastMoves);
  const history = ChessGameContext.useSelector((c) => c.context.history);

  const historyType = {
    white: history.filter((h) => h.piece.type === "white"),
    black: history.filter((h) => h.piece.type === "black"),
  };

  useEffect(() => {
    if (containerEl.current) {
      containerEl.current.scrollTo({
        top: containerEl.current.scrollHeight,
        behavior: mounted.current ? "smooth" : "instant",
      });

      mounted.current = true;
    }
  }, [history.length]);

  if (!players) {
    return <></>;
  }

  return (
    <div
      ref={containerEl}
      className="w-full py-2 flex justify-between max-h-96 overflow-y-auto no-scrollbar"
    >
      <div className="w-1/2 flex flex-col space-y-3">
        {players.A && (
          <HistoryItem
            histories={historyType[players.A.color]}
            lastMoves={lastMoves}
            emplacement="left"
          />
        )}
      </div>
      <div className="w-1/2 flex flex-col space-y-3">
        {players.B && (
          <HistoryItem
            histories={historyType[players.B.color]}
            lastMoves={lastMoves}
            emplacement="right"
          />
        )}
      </div>
    </div>
  );
}

function HistoryItem({
  histories,
  lastMoves,
  emplacement,
}: {
  histories: GHistory;
  lastMoves: TLastMoves | undefined;
  emplacement: "left" | "right";
}) {
  return histories.map((history, i) => {
    const active =
      history.newPosition === lastMoves?.newPosition &&
      history.oldPosition === lastMoves?.oldPosition &&
      history.piece.id === lastMoves?.piece.id;

    return (
      <div
        key={i}
        className={cn(emplacement === "left" ? "text-left" : "text-right")}
      >
        <span
          className={cn(
            active && ["bg-slate-50/10"],
            "font-sans font-semibold p-1 px-2 rounded-md",
            "cursor-pointer relative"
          )}
        >
          <PieceImg
            piece={history.piece}
            className={cn(
              "scale-50 origin-top absolute opacity-60",
              emplacement === "left" ? "-left-2" : "right-4"
            )}
          />
          <span className="pl-5">{history.newPosition}</span>
        </span>
      </div>
    );
  });
}
