import { Board, BoardPiece, BoardType, PieceMovesHistory } from "..";
import { getKnightMoves } from "./knight";
import { getRookMoves } from "./rook";
import { getSpawnMoves } from "./spawn";

export type Params = {
  piece: NonNullable<BoardPiece>;
  position: string;
  board: Board[];
  history: PieceMovesHistory;
  boardType: BoardType;
};

export function getPieceMoves(params: Params): string[] {
  switch (params.piece.value) {
    case "king":
      return [];
      break;

    case "queen":
      return [];
      break;

    case "bishop":
      return [];
      break;

    case "knight":
      return getKnightMoves(params);
      break;

    case "rook":
      return getRookMoves(params);
      break;

    case "pawn":
      return getSpawnMoves(params);
      break;

    default:
      throw new Error("Unknown Piece type");
      break;
  }
}
