import { Params } from ".";
import { numberizePiecePosition } from "../helpers";
import { getBishopPositions } from "./bishop";
import { setRookMoves } from "./rook";

export function getQueenMoves(params: Params) {
  const piece = params.piece;
  const [pieceColumn, pieceRow] = numberizePiecePosition(params.position);

  const moves: string[] = [];
  const mutateRookMoves = setRookMoves(piece, params.position, moves);

  // Bishop
  const bishopPositions = getBishopPositions(pieceColumn, pieceRow);
  let tmpMoves: Record<
    "tr" | "tl" | "bl" | "br",
    ({ p: string; stop: boolean } | undefined)[]
  > = {
    tr: [],
    tl: [],
    bl: [],
    br: [],
  };

  for (const column of params.board) {
    for (const box of column) {
      const emptyBox = !box.piece;
      const canTake = box.piece ? box.piece.color !== piece.color : false;
      const [pColumn, pRow] = numberizePiecePosition(box.position);

      // Rook Moves
      mutateRookMoves(box);

      // Bishop Moves
      const pPosition = bishopPositions.find(
        (t) => t.position === `${pColumn}${pRow}`
      );
      if (pPosition) {
        if (canTake) {
          tmpMoves[pPosition.direction].push({ p: box.position, stop: true });
        } else if (emptyBox) {
          tmpMoves[pPosition.direction].push({ p: box.position, stop: false });
        } else {
          tmpMoves[pPosition.direction].push(undefined);
        }
      }
    }
  }

  // Bishop merge moves
  function merger(
    acc: boolean,
    value: { p: string; stop: boolean } | undefined
  ) {
    if (!acc || !value) return false;

    if (value.stop) {
      moves.push(value.p);
      return false;
    }

    moves.push(value.p);

    return true;
  }

  // Merge moves
  // Top right
  tmpMoves.tr.reverse().reduce(merger, true);

  // Top left
  tmpMoves.tl.reverse().reduce(merger, true);

  // bottom left
  tmpMoves.bl.reduce(merger, true);

  // bottom top
  tmpMoves.br.reduce(merger, true);

  return moves;
}
