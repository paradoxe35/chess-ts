export const CHESS_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const CHESS_COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

type Piece = { position: string }[];

export const CHESS_BOARD = {};

export function createBoard(): Piece[] {
  return CHESS_ROWS.reduce((acc, row) => {
    const piece: Piece = [];

    CHESS_COLUMNS.forEach((colum) => {
      piece.push({ position: row + colum });
    });

    acc.push(piece);
    return acc;
  }, [] as Piece[]).reverse();
}
