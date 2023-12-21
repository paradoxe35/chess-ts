import { Board, BoardPiece, BoardType, PieceMovesHistory } from "..";
import { getBishopMoves } from "./bishop";
import { getKingMoves } from "./king";
import { getKnightMoves } from "./knight";
import { getQueenMoves } from "./queen";
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
      return getKingMoves(params);
      break;

    case "queen":
      return getQueenMoves(params);
      break;

    case "bishop":
      return getBishopMoves(params);
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
