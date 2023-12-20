import { Params } from ".";
import { BoardPiece, BoardPosition } from "../board";
import { numberizePiecePosition } from "../helpers";

export function setRookMoves(
  piece: BoardPiece,
  position: string,
  moves: string[]
) {
  let [pieceColumn, pieceRow] = numberizePiecePosition(position);

  // Temporal allocation variables
  let verticalMoves: ({ p: string; stop: boolean } | undefined)[] = [];
  let horizontalMoves: ({ p: string; stop: boolean } | undefined)[] = [];

  return (box: BoardPosition) => {
    const [pColumn, pRow] = numberizePiecePosition(box.position);

    const emptyBox = !box.piece;
    const samePosition = box.position === position;
    const canTake = box.piece ? box.piece.type !== piece.type : false;

    // Vertical check
    if (pColumn === pieceColumn) {
      if (samePosition) {
        const topMoves = verticalMoves.reverse().reduce(
          (acc, v) => {
            if (acc.stop || !v) {
              acc.stop = true;
              return acc;
            }

            if (v.stop) {
              acc.stop = true;
            }

            acc.moves.push(v.p);

            return acc;
          },
          {
            moves: [] as string[],
            stop: false,
          }
        );

        moves.push(...topMoves.moves);

        // We must reset the array for bottom moves
        verticalMoves = [];
      }

      // Top moves checks
      if (pRow > pieceRow) {
        if (canTake) {
          verticalMoves.push({ p: box.position, stop: true });
        } else if (emptyBox) {
          verticalMoves.push({ p: box.position, stop: false });
        } else {
          verticalMoves.push(undefined);
        }
      }

      // Bottom moves checks
      if (pRow < pieceRow && !verticalMoves.includes(undefined)) {
        if (emptyBox) {
          moves.push(box.position);
        } else if (canTake) {
          // Can take the piece but stop there
          moves.push(box.position);
          verticalMoves.push(undefined);
        } else {
          verticalMoves.push(undefined);
        }
      }
    }

    // Horizontal  check
    if (pRow === pieceRow) {
      if (samePosition) {
        const leftMoves = horizontalMoves.reverse().reduce(
          (acc, v) => {
            if (acc.stop || !v) {
              acc.stop = true;
              return acc;
            }

            if (v.stop) {
              acc.stop = true;
            }

            acc.moves.push(v.p);

            return acc;
          },
          {
            moves: [] as string[],
            stop: false,
          }
        );

        moves.push(...leftMoves.moves);

        // We must reset the array for bottom moves
        horizontalMoves = [];
      }

      // Left moves checks
      if (pieceColumn > pColumn) {
        if (canTake) {
          horizontalMoves.push({ p: box.position, stop: true });
        } else if (emptyBox) {
          horizontalMoves.push({ p: box.position, stop: false });
        } else {
          horizontalMoves.push(undefined);
        }
      }

      // Right moves checks
      if (pColumn > pieceColumn && !horizontalMoves.includes(undefined)) {
        if (emptyBox) {
          moves.push(box.position);
        } else if (canTake) {
          // Can the piece but stop there
          moves.push(box.position);
          horizontalMoves.push(undefined);
        } else {
          horizontalMoves.push(undefined);
        }
      }
    }
  };
}

export function getRookMoves(params: Params) {
  const piece = params.piece;

  const moves: string[] = [];
  const mutateMoves = setRookMoves(piece, params.position, moves);

  for (const column of params.board) {
    for (const box of column) {
      mutateMoves(box);
    }
  }

  return moves;
}
