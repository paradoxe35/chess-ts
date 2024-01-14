import { Fragment, RefObject } from "react";
import { BoardPosition } from "@/chess";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChessGameContext } from "@/state";
import { getPieceImageSrc } from "@/assets/pieces";

type Props<T = {}> = { boardRef?: RefObject<HTMLDivElement> } & T;

export function ChessPieces(props: Props) {
  const chessGame = ChessGameContext.useActorRef();
  const board = ChessGameContext.useSelector((s) => s.context.board);
  const pieceMove = ChessGameContext.useSelector((s) => s.context.pieceMove);

  const handlePieceClick = (box: BoardPosition) => {
    chessGame.send({
      type: "chess.playing.setMove.reset",
    });

    if (pieceMove?.piece.id !== box.piece?.id) {
      box.piece &&
        chessGame.send({
          type: "chess.playing.getMoves",
          piece: box.piece,
          position: box.position,
        });
    }
  };

  return board.map((column, yi) => {
    return column.map((box, xi) => {
      if (!box.piece) {
        return <Fragment key={box.position}></Fragment>;
      }

      return (
        <Piece
          key={box.position}
          boardRef={props.boardRef}
          onClick={handlePieceClick}
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
  onClick,
}: Props<{
  box: BoardPosition;
  xi: number;
  yi: number;
  onClick?: (box: BoardPosition) => void;
}>) {
  const piece = box.piece!;

  return (
    <motion.div
      key={piece.id}
      className={cn(
        "absolute w-[12.5%] pt-[12.5%] z-10",
        "top-0 left-0",
        "bg-no-repeat bg-[50%]",
        "flex justify-center"
      )}
      style={{
        backgroundImage: `url(${getPieceImageSrc(piece)})`,
        transform: `translate(${xi * 100}%, ${yi * 100}%)`,
      }}
    >
      <div
        title={piece.value}
        onClick={() => onClick && onClick(box)}
        className="w-3/4 h-3/4 -mt-[85%] cursor-pointer absolute"
      />
    </motion.div>
  );
}
