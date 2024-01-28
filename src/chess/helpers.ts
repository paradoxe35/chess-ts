import { PieceMove, PlayerDetail } from "@/state";
import { BoardPiece, CHESS_COLUMNS, PieceColor } from ".";
import { TCheckmate } from "./checkmate";

export function numberizePiecePosition(position: string) {
  const [column, row] = position.split("");

  return [CHESS_COLUMNS.indexOf(column) + 1, +row] as const;
}

/**
 * When checkmate only king click is allowed
 *
 * @param checkmate
 * @param playerColor
 * @param piecePosition
 * @returns
 */
export function invalidPieceMovesOnCheckmate(
  activePlayer: PlayerDetail | undefined,
  checkmate: TCheckmate | undefined,
  piece: BoardPiece | undefined
) {
  return (
    checkmate?.checked &&
    piece &&
    piece.color === checkmate.on &&
    activePlayer?.color === checkmate.on &&
    checkmate.playerKingPosition.piece?.id !== piece.id
  );
}

/**
 * Invalid move when target move is in excluded moves
 *
 * @param checkmate
 * @param playerColor
 * @param piecePosition
 * @returns
 */
export function invalidTargetMoveOnCheckmate(
  checkmate: TCheckmate | undefined,
  pieceMove: PieceMove | null,
  targetPosition: string
) {
  return (
    checkmate?.checked &&
    pieceMove &&
    pieceMove.piece.id === checkmate.playerKingPosition.piece?.id &&
    checkmate.excludedMoves.includes(targetPosition)
  );
}
