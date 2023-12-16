import { CHESS_COLUMNS } from "..";
import { type Params } from ".";

export function getSpawnMoves(params: Params) {
  const piece = params.piece;
  const [pieceColumn, pieceRow] = params.position.split("");
  const pieceColumnIndex = CHESS_COLUMNS.indexOf(pieceColumn) + 1;
  const canMoveTwo = !params.history[piece.id!]?.length;

  const moves: string[] = [];

  let moveDirection: "incr" | "decr" = "incr";
  if (params.boardType.startsWith(piece.type)) {
    moveDirection = "decr";
  }

  for (const column of params.board) {
    // With the column +1
    column.forEach((box) => {
      const [pColumn, pRow] = box.position.split("");
      const pColumnIndex = CHESS_COLUMNS.indexOf(pColumn) + 1;

      const emptyBox = !box.piece;
      const canTake = box.piece ? box.piece.type !== piece.type : false;

      const workingRow =
        moveDirection === "incr"
          ? +pRow - +pieceRow === 1
          : +pieceRow - +pRow === 1;

      const leftCheck =
        moveDirection === "incr"
          ? pieceColumnIndex - pColumnIndex === 1
          : pColumnIndex - pieceColumnIndex === 1;

      const rightCheck =
        moveDirection === "incr"
          ? pColumnIndex - pieceColumnIndex === 1
          : pieceColumnIndex - pColumnIndex === 1;

      // If pawn same column (+1)
      if (workingRow) {
        if (pieceColumnIndex === pColumnIndex && emptyBox) {
          moves.push(box.position);
        } else if (leftCheck && canTake) {
          moves.push(box.position);
        } else if (rightCheck && canTake) {
          moves.push(box.position);
        }
      }

      // Can move +2
      const workingRow2 =
        moveDirection === "incr"
          ? +pRow - +pieceRow === 2
          : +pieceRow - +pRow === 2;

      if (canMoveTwo && workingRow2) {
        if (pieceColumnIndex === pColumnIndex && emptyBox) {
          moves.push(box.position);
        }
      }
    });
  }

  return moves;
}
