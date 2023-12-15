import type { Board, BoardPiece, PieceMovesHistory } from ".";

type Params = {
  piece: NonNullable<BoardPiece>;
  position: string;
  board: Board[];
  history: PieceMovesHistory;
};

export function getPieceMoves(params: Params): string[] {
  console.log(params);

  switch (params.piece.value) {
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
