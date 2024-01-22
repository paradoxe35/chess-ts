import React, { useEffect, useRef } from "react";
import { ChessGameContext, GHistory, TLastMoves, T_HistoryItem } from "@/state";
import { cn } from "@/utils/cn";
import { PieceImg } from "@/components/ui/piece";
import { Players } from "./components/players";
import { useScrollToBottom } from "@/utils/scroll-to-bottom";

export function History() {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Players />

      <ShowHistories />
    </div>
  );
}

function ShowHistories() {
  const players = ChessGameContext.useSelector((c) => c.context.players);
  const lastMoves = ChessGameContext.useSelector((c) => c.context.lastMoves);
  const histories = ChessGameContext.useSelector((c) => c.context.histories);

  const { containerEl } = useScrollToBottom(histories.length);

  const historyType = {
    white: histories.filter((h) => h.piece.type === "white"),
    black: histories.filter((h) => h.piece.type === "black"),
  };

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
  const chessGame = ChessGameContext.useActorRef();
  const hasGetMovesState = ChessGameContext.useSelector((c) =>
    c.matches("playing.getMoves")
  );

  const rollbackBackOnHistory = (_history: T_HistoryItem) => {
    chessGame.send({
      type: "chess.playing.getMoves.history-rollback",
      historyItem: _history,
    });
  };

  return histories.map((_history) => {
    const active =
      _history.newPosition === lastMoves?.newPosition &&
      _history.oldPosition === lastMoves?.oldPosition &&
      _history.piece.id === lastMoves?.piece.id;

    return (
      <div
        key={_history.id}
        className={cn(emplacement === "left" ? "text-left" : "text-right")}
      >
        <span
          className={cn(
            "relative font-sans font-semibold p-1 px-2 rounded-md cursor-default",
            active && ["bg-slate-50/10"],
            !active && hasGetMovesState && "cursor-pointer"
          )}
          onClick={() =>
            !active && hasGetMovesState && rollbackBackOnHistory(_history)
          }
        >
          <PieceImg
            piece={_history.piece}
            className={cn(
              "scale-50 origin-top absolute opacity-60",
              emplacement === "left" ? "-left-2" : "right-5"
            )}
          />
          <span className="pl-5">{_history.newPosition}</span>
        </span>
      </div>
    );
  });
}
