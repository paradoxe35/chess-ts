import { Fragment, RefObject, useEffect } from "react";
import { BoardPiece, BoardPosition, createBoard } from "@/chess";
import pieces from "@/assets/pieces";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChessGameContext } from "@/state";

function getPieceImage(piece: BoardPiece) {
  const svg_icons = pieces[piece.type];
  const icon = svg_icons[piece.value];

  return icon.src as string;
}

type Props<T = {}> = { boardRef?: RefObject<HTMLDivElement> } & T;

export function ChessPieces(props: Props) {
  const board = ChessGameContext.useSelector((s) => s.context.board);

  return board.map((column, yi) => {
    return column.map((box, xi) => {
      if (!box.piece) {
        return <Fragment key={box.position}></Fragment>;
      }

      return (
        <Piece
          key={box.position}
          boardRef={props.boardRef}
          box={box}
          yi={yi}
          xi={xi}
        />
      );
    });
  });
}

function Piece({
  box,
  xi,
  yi,
}: Props<{ box: BoardPosition; xi: number; yi: number }>) {
  const piece = box.piece!;

  return (
    <motion.div
      key={piece.id}
      animate={{
        transform: `translate(${xi * 100}%, ${yi * 100}%)`,
      }}
      className={cn(
        "absolute w-[12.5%] pt-[12.5%] z-10",
        "top-0 left-0",
        "bg-no-repeat bg-[50%]",
        "flex justify-center"
      )}
      style={{
        backgroundImage: `url(${getPieceImage(piece)})`,
      }}
    >
      <div
        title={piece.value}
        className="w-3/4 h-3/4 -mt-[85%] cursor-pointer absolute"
      />
    </motion.div>
  );
}
