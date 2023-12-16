import { type Params } from ".";
import { numberizePiecePosition } from "../helpers";

export function getSpawnMoves(params: Params) {
  const piece = params.piece;
  const [pieceColumn, pieceRow] = numberizePiecePosition(params.position);
  const canMoveTwo = !params.history[piece.id!]?.length;

  let moves: string[] = [];

  let moveDirection: "bottom-top" | "top-bottom" = "bottom-top";
  if (params.boardType.startsWith(piece.type)) {
    moveDirection = "top-bottom";
  }

  let skipNextBox = false;

  for (const column of params.board) {
    for (const box of column) {
      const [pColumn, pRow] = numberizePiecePosition(box.position);
      const emptyBox = !box.piece;
      const canTake = box.piece ? box.piece.type !== piece.type : false;

      const workingRow =
        moveDirection === "bottom-top"
          ? pRow - pieceRow === 1
          : pieceRow - pRow === 1;

      const workingRow2 =
        moveDirection === "bottom-top"
          ? pRow - pieceRow === 2
          : pieceRow - pRow === 2;

      const leftCheck =
        moveDirection === "bottom-top"
          ? pieceColumn - pColumn === 1
          : pColumn - pieceColumn === 1;

      const rightCheck =
        moveDirection === "bottom-top"
          ? pColumn - pieceColumn === 1
          : pieceColumn - pColumn === 1;

      // If pawn same column (+1)
      if (workingRow) {
        if (pieceColumn === pColumn && emptyBox) {
          moves.push(box.position);
        } else if (leftCheck && canTake) {
          moves.push(box.position);
        } else if (rightCheck && canTake) {
          moves.push(box.position);
        }

        // Up front Box condition
        if (pieceColumn === pColumn && !emptyBox) {
          skipNextBox = true;
        }

        if (
          moveDirection === "bottom-top" &&
          pieceColumn === pColumn &&
          canMoveTwo &&
          !emptyBox
        ) {
          moves = moves.slice(0, moves.length - 1);
        }
      }

      // Can move +2
      if (canMoveTwo && workingRow2) {
        if (pieceColumn === pColumn && emptyBox && !skipNextBox) {
          moves.push(box.position);
        }
      }
    }
  }

  return moves;
}
