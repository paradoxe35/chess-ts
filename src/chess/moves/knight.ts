import { Params } from ".";
import { numberizePiecePosition } from "../helpers";

const POSITIONS_SUB = [8, -8, 19, -19, 12, -12, 21, -21]; // This values cannot be changed

export function getKnightMoves(params: Params): string[] {
  const piece = params.piece;
  const [pieceColumn, pieceRow] = numberizePiecePosition(params.position);
  const piecePosSum = +`${pieceColumn}${pieceRow}`;

  const moves: string[] = [];

  for (const column of params.board) {
    for (const box of column) {
      const [pColumn, pRow] = numberizePiecePosition(box.position);
      const emptyBox = !box.piece;
      const canTake = box.piece ? box.piece.color !== piece.color : false;
      const pPosSum = +`${pColumn}${pRow}`;

      const position = piecePosSum - pPosSum;
      if (POSITIONS_SUB.includes(position) && (emptyBox || canTake)) {
        moves.push(box.position);
      }
    }
  }

  return moves;
}
