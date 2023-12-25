import React, { PropsWithChildren } from "react";
import { CHESS_COLUMNS, createBoard } from "@/chess";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const board = createBoard("empty");

export const ChessBoard = React.forwardRef<HTMLDivElement, PropsWithChildren>(
  (props, ref) => {
    return (
      <div className={cn("board", "rounded-lg p-6 bg-slate-50/10 w-full")}>
        <div className="board-wrapper relative">
          <BoardHints />

          <motion.div
            className="board-container rounded-lg w-full overflow-hidden relative"
            ref={ref}
          >
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

            {props.children}
          </motion.div>
        </div>
      </div>
    );
  }
);

ChessBoard.displayName = "ChessBoard";

function BoardHints() {
  const column = (
    <>
      {CHESS_COLUMNS.map((_, i) => {
        return <div key={i}>{CHESS_COLUMNS.length - i}</div>;
      })}
    </>
  );

  const row = (
    <>
      {CHESS_COLUMNS.map((v) => {
        return <div key={v}>{v}</div>;
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
