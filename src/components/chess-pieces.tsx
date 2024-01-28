import { Fragment, RefObject } from "react";
import { BoardPosition } from "@/chess";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChessGameContext } from "@/state";
import { getPieceImageSrc } from "@/assets/pieces";
import { invalidPieceMovesOnCheckmate } from "@/chess/helpers";
import { toast } from "sonner";

type Props<T = {}> = { boardRef?: RefObject<HTMLDivElement> } & T;

export function ChessPieces(props: Props) {
  const chessGame = ChessGameContext.useActorRef();
  const context = ChessGameContext.useSelector((s) => s.context);

  const handlePieceClick = (box: BoardPosition) => {
    chessGame.send({
      type: "chess.playing.setMove.reset",
    });

    if (context.rolledBackHistory) {
      const lHistory = context.histories[context.histories.length - 1];

      lHistory &&
        chessGame.send({
          type: "chess.playing.getMoves.history-rollback",
          historyItem: lHistory,
        });
      return;
    }

    // Checkmate Notification
    if (
      invalidPieceMovesOnCheckmate(
        context.activePlayer,
        context.checkmate,
        box.piece
      )
    ) {
      toast.warning("Move your King, you're checkmated");
      return false;
    }

    if (
      box.piece &&
      context.pieceMove?.piece.id !== box.piece?.id &&
      context.activePlayer
    ) {
      chessGame.send({
        type: "chess.playing.getMoves",
        piece: box.piece,
        position: box.position,
        player: context.activePlayer,
      });
    }
  };

  return context.board.map((row, yi) => {
    return row.map((cell, xi) => {
      if (!cell.piece) {
        return <Fragment key={cell.position}></Fragment>;
      }

      return (
        <Piece
          key={cell.piece.id}
          boardRef={props.boardRef}
          onClick={handlePieceClick}
          cell={cell}
          yi={yi}
          xi={xi}
        />
      );
    });
  });
}

function Piece({
  cell,
  xi,
  yi,
  onClick,
}: Props<{
  cell: BoardPosition;
  xi: number;
  yi: number;
  onClick?: (cell: BoardPosition) => void;
}>) {
  const piece = cell.piece!;

  const style = {
    top: yi * 12.5 + "%",
    left: xi * 12.5 + "%",
  };
  return (
    <motion.div
      key={piece.id}
      layoutId={piece.id}
      className={cn(
        "absolute w-[12.5%] pt-[12.5%] z-10",
        "bg-no-repeat bg-[50%]",
        "flex justify-center"
      )}
      initial={style}
      animate={style}
      transition={{ type: "just" }}
      style={{ backgroundImage: `url(${getPieceImageSrc(piece)})` }}
    >
      <div
        title={piece.type}
        onClick={() => onClick && onClick(cell)}
        className="w-3/4 h-3/4 -mt-[85%] cursor-pointer absolute"
      />
    </motion.div>
  );
}
