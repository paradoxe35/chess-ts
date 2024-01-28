import { useEffect, useRef } from "react";
import { Players } from "./components/players";
import { ChessGameContext, GHistory, PlayersPoints } from "@/state";
import { BoardPiece, PIECE_POINTS } from "@/chess";
import { PieceImg } from "@/components/ui/piece";
import { cn } from "@/utils/cn";
import { useScrollToBottom } from "@/utils/scroll-to-bottom";

export function Points() {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Players />

      <ShowPoints />
    </div>
  );
}

function ShowPoints() {
  const players = ChessGameContext.useSelector((c) => c.context.players);
  const selectedHistory = ChessGameContext.useSelector(
    (c) => c.context.selectedHistory
  );

  const { containerEl } = useScrollToBottom(selectedHistory);

  const pointes = (selectedHistory?.pointes || {}) as PlayersPoints;

  return (
    <div
      ref={containerEl}
      className="w-full py-2 flex justify-stretch max-h-96 overflow-y-auto no-scrollbar"
    >
      <div className="w-1/2 border-r border-r-slate-50/25">
        {players?.A && (
          <PointItems pieces={pointes[players?.A.color]} emplacement="right" />
        )}
      </div>

      <div className="w-1/2">
        {players?.B && (
          <PointItems pieces={pointes[players?.B.color]} emplacement="left" />
        )}
      </div>
    </div>
  );
}

function PointItems({
  pieces,
  emplacement,
}: {
  pieces?: BoardPiece[];
  emplacement: "left" | "right";
}) {
  const point = pieces?.reduce((acc, piece) => {
    acc += PIECE_POINTS[piece.type];
    return acc;
  }, 0);

  return (
    <div className={cn("w-full", emplacement === "right" ? "pr-2" : "pl-2")}>
      <h3 className="text-center font-bold text-xl mb-5">{point || 0}</h3>

      <div className="flex justify-between flex-wrap w-full gap-4">
        {pieces?.map((piece) => {
          return (
            <PieceImg
              key={piece.id}
              title={`${PIECE_POINTS[piece.type]}`}
              piece={piece}
            />
          );
        })}
      </div>
    </div>
  );
}
