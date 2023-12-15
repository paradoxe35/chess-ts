import type { Board, BoardPiece } from ".";

export function getPieceMoves(
  piece: NonNullable<BoardPiece>,
  position: string,
  board: Board[]
): string[] {
  switch (piece.value) {
    case "bishop":
      return [];
      break;

    case "king":
      return [];
      break;

    case "knight":
      return [];
      break;

    case "pawn":
      return [];
      break;

    case "queen":
      return [];
      break;

    case "rook":
      return [];
      break;

    default:
      throw new Error("Unknown Piece type");
      break;
  }
}
