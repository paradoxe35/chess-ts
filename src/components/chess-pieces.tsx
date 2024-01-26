import { Fragment, RefObject } from "react";
import { BoardPosition } from "@/chess";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ChessGameContext } from "@/state";
import { getPieceImageSrc } from "@/assets/pieces";

type Props<T = {}> = { boardRef?: RefObject<HTMLDivElement> } & T;

export function ChessPieces(props: Props) {
  const chessGame = ChessGameContext.useActorRef();
  const rolledBackHistory = ChessGameContext.useSelector(
    (s) => s.context.rolledBackHistory
  );

  const activePlayer = ChessGameContext.useSelector(
    (s) => s.context.activePlayer
  );

  const board = ChessGameContext.useSelector((s) => s.context.board);
  const pieceMove = ChessGameContext.useSelector((s) => s.context.pieceMove);
  const histories = ChessGameContext.useSelector((s) => s.context.histories);

  const handlePieceClick = (box: BoardPosition) => {
    chessGame.send({
      type: "chess.playing.setMove.reset",
    });

    if (rolledBackHistory) {
      const lHistory = histories[histories.length - 1];

      if (lHistory)
        chessGame.send({
          type: "chess.playing.getMoves.history-rollback",
          historyItem: lHistory,
        });
      return;
    }

    if (box.piece && pieceMove?.piece.id !== box.piece?.id && activePlayer) {
      chessGame.send({
        type: "chess.playing.getMoves",
        piece: box.piece,
        position: box.position,
        player: activePlayer,
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
          key={box.piece.id}
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
        title={piece.value}
        onClick={() => onClick && onClick(box)}
        className="w-3/4 h-3/4 -mt-[85%] cursor-pointer absolute"
      />
    </motion.div>
  );
}
