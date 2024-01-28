import type { Params } from ".";
import { numberizePiecePosition } from "../helpers";

export function getBishopPositions(pieceColumn: number, pieceRow: number) {
  const positions: {
    direction: "tr" | "tl" | "bl" | "br";
    position: string;
  }[] = [];

  // top right
  let tr_x = pieceRow,
    tr_y = pieceColumn;
  while (tr_x <= 8 && tr_y <= 8) {
    tr_x++;
    tr_y++;
    positions.push({
      position: `${tr_y}${tr_x}`,
      direction: "tr",
    });
  }

  // top left
  let tl_x = pieceRow,
    tl_y = pieceColumn;
  while (tl_x <= 8 && tl_y >= 1) {
    tl_x++;
    tl_y--;
    positions.push({
      position: `${tl_y}${tl_x}`,
      direction: "tl",
    });
  }

  // bottom left
  let bl_x = pieceRow,
    bl_y = pieceColumn;
  while (bl_x >= 1 && bl_y >= 1) {
    bl_x--;
    bl_y--;
    positions.push({
      position: `${bl_y}${bl_x}`,
      direction: "bl",
    });
  }

  // bottom right
  let br_x = pieceRow,
    br_y = pieceColumn;
  while (br_x >= 1 && br_y <= 8) {
    br_x--;
    br_y++;
    positions.push({
      position: `${br_y}${br_x}`,
      direction: "br",
    });
  }

  return positions;
}

export function getBishopMoves(params: Params): string[] {
  const piece = params.piece;
  const [pieceColumn, pieceRow] = numberizePiecePosition(params.position);

  const positions = getBishopPositions(pieceColumn, pieceRow);
  const moves: string[] = [];

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
      const pPosition = positions.find(
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
