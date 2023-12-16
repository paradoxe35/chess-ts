import { getSpawnMoves } from "./spawn";
import { Params } from "./type";

export function getPieceMoves(params: Params): string[] {
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
      return getSpawnMoves(params);
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
