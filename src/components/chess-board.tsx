import React, { PropsWithChildren } from "react";
import { CHESS_COLUMNS, createBoard } from "@/chess";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChessGameContext } from "@/state";

const board = createBoard("empty");

export const ChessBoard = React.forwardRef<HTMLDivElement, PropsWithChildren>(
  (props, ref) => {
    const chessGame = ChessGameContext.useActorRef();
    const pieceMove = ChessGameContext.useSelector((s) => s.context.pieceMove);
    const lastMoves = ChessGameContext.useSelector((s) => s.context.lastMoves);

    const handleMove = (newPosition: string) => {
      chessGame.send({
        type: "chess.playing.setMove",
        movePosition: newPosition,
      });
    };

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
                    const hasMoveSelection = pieceMove?.moves.includes(
                      cell.position
                    );
                    const hasLastMove = lastMoves.includes(cell.position);
                    const currentPiecePosition =
                      pieceMove?.position === cell.position;

                    return (
                      <div
                        key={cell.position}
                        data-cell={cell.position}
                        onClick={
                          hasMoveSelection
                            ? () => handleMove(cell.position)
                            : undefined
                        }
                        className={cn(
                          "relative",
                          "w-[12.5%] pt-[12.5%]",
                          "flex justify-center items-center",
                          !colored && "bg-slate-50/80",
                          colored && "bg-slate-50/10",

                          hasLastMove && [
                            'before:content-[""] before:absolute',
                            "before:w-3/4 before:h-3/4 before:-mt-[100%]",
                          ],

                          (hasMoveSelection || currentPiecePosition) && [
                            'after:content-[""] after:absolute',
                            "after:w-3/4 after:h-3/4 after:-mt-[100%]",
                          ],

                          (hasMoveSelection || currentPiecePosition) && [
                            "after:cursor-pointer",
                            "after:outline after:outline-pink-400 after:outline-[2px]",
                            currentPiecePosition
                              ? "after:z-10 after:rounded-full"
                              : "after:z-20",
                          ],

                          hasLastMove &&
                            !hasMoveSelection && [
                              "before:rounded-full",
                              "before:bg-pink-300/45",
                              "before:z-10",
                            ]
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
