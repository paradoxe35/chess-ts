import { CHESS_COLUMNS } from ".";

export function numberizePiecePosition(position: string) {
  const [column, row] = position.split("");

  return [CHESS_COLUMNS.indexOf(column) + 1, +row] as const;
}
