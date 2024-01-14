import React from "react";
import { Circle } from "@/components/ui/circle";
import { ChessGameContext, GHistory, TLastMoves } from "@/state";
import { cn } from "@/utils/cn";
import { PieceImg } from "@/components/ui/piece";

export function Overview() {
  const player = ChessGameContext.useSelector((c) => c.context.player);
  const players = ChessGameContext.useSelector((c) => c.context.players);

  if (!players) {
    return <></>;
  }

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex justify-between border-b-2 border-b-slate-200/20 pb-3">
        {players.A && (
          <div className="flex flex-col justify-center items-center">
            <img
              className={cn(
                "w-10 h-10 rounded-full p-1 ring-2",
                players.A.color === player ? "ring-pink-500" : "ring-gray-500"
              )}
              src={players.A.image}
              alt={players.A.name}
            />
            <span className="capitalize inline-flex gap-1 items-center">
              {players.A.name}{" "}
              <Circle knight size={30} color={players.A.color} />
            </span>
          </div>
        )}

        {players.B && (
          <div className="flex flex-col items-center justify-center">
            <img
              className={cn(
                "w-10 h-10 rounded-full p-1 ring-2",
                players.B.color === player ? "ring-pink-500" : "ring-gray-500"
              )}
              src={players.B.image}
              alt={players.B.name}
            />
            <span className="capitalize inline-flex gap-1 items-center">
              {players.B.name}{" "}
              <Circle knight size={30} color={players.B.color} />
            </span>
          </div>
        )}
      </div>

      <ShowHistories />
    </div>
  );
}

const ShowHistories = React.memo(() => {
  const players = ChessGameContext.useSelector((c) => c.context.players);
  const lastMoves = ChessGameContext.useSelector((c) => c.context.lastMoves);
  const history = ChessGameContext.useSelector((c) => c.context.history);

  const historyType = {
    white: history.filter((h) => h.piece.type === "white"),
    black: history.filter((h) => h.piece.type === "black"),
  };

  if (!players) {
    return <></>;
  }

  return (
    <div className="w-full flex justify-between max-h-96 overflow-y-auto no-scrollbar">
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
});

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

ShowHistories.displayName = "ShowHistories";
