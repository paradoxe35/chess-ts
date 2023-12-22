import { CHESS_COLUMNS, createBoard } from "@/chess";
import { cn } from "@/utils/cn";
import React, { PropsWithChildren } from "react";

export function ChessBoard(props: PropsWithChildren) {
  return (
    <div className="relative w-full">
      <Board />

      <div className="w-full">{props.children}</div>
    </div>
  );
}

const Board = React.memo(() => {
  const board = createBoard("empty");

  return (
    <div className={cn("board", "rounded-lg p-6 bg-slate-50/10 w-full")}>
      <div className="board-wrapper relative">
        <BoardHints />

        <div className="board-container rounded-lg w-full overflow-hidden relative">
          {board.map((row, i) => {
            return (
              <div key={i} className="w-full flex">
                {row.map((cell, ci) => {
                  const colored = (i + ci + 1) % 2 === 0;

                  return (
                    <div
                      key={cell.position}
                      data-cell={cell.position}
                      className={cn(
                        "w-[12.5%]",
                        "pt-[12.5%]",
                        !colored && "bg-slate-50/80",
                        colored && "bg-slate-50/10"
                      )}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

function BoardHints() {
  const column = (
    <>
      {CHESS_COLUMNS.map((_, i) => {
        return <div>{CHESS_COLUMNS.length - i}</div>;
      })}
    </>
  );

  const row = (
    <>
      {CHESS_COLUMNS.map((v) => {
        return <div>{v}</div>;
      })}
    </>
  );

  const yClassName =
    "flex flex-col absolute justify-between top-0 bottom-0 py-[4%] font-sans text-white/70 font-medium text-sm md:text-base";
  const xClassName =
    "flex flex-row absolute justify-between left-0 right-0 px-[4%] font-sans text-white/70 font-medium text-sm md:text-base";

  return (
    <>
      {/* Y */}
      <div className={cn(yClassName, "-left-4")}>{column}</div>
      <div className={cn(yClassName, "-right-4")}>{column}</div>

      {/* X */}
      <div className={cn(xClassName, "-top-6")}>{row}</div>
      <div className={cn(xClassName, "-bottom-6")}>{row}</div>
    </>
  );
}

Board.displayName = "Board";
