export type PieceColor = "black" | "white";
export type PieceType =
  | "bishop"
  | "king"
  | "knight"
  | "pawn"
  | "queen"
  | "rook";

type PiecePoint = {
  +readonly [x in Exclude<PieceType, "king">]: number;
};

export const PIECE_POINTS: PiecePoint = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
} as const;
