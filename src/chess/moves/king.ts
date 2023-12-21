import { Params } from ".";
import { numberizePiecePosition } from "../helpers";

export function getKingMoves(params: Params): string[] {
  const piece = params.piece;
  const [pieceColumn, pieceRow] = numberizePiecePosition(params.position);

  const positions = [
    `${pieceColumn - 1}${pieceRow + 1}`,
    `${pieceColumn}${pieceRow + 1}`,
    `${pieceColumn + 1}${pieceRow + 1}`,
    `${pieceColumn - 1}${pieceRow}`,
    `${pieceColumn + 1}${pieceRow}`,
    `${pieceColumn - 1}${pieceRow - 1}`,
    `${pieceColumn}${pieceRow - 1}`,
    `${pieceColumn + 1}${pieceRow - 1}`,
  ];

  const moves: string[] = [];

  for (const column of params.board) {
    for (const box of column) {
      const [pColumn, pRow] = numberizePiecePosition(box.position);
      const emptyBox = !box.piece;
      const canTake = box.piece ? box.piece.type !== piece.type : false;

      if (positions.includes(`${pColumn}${pRow}`) && (emptyBox || canTake)) {
        moves.push(box.position);
      }
    }
  }

  return moves;
}
