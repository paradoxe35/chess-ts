import { PieceColor } from "@/chess";

export const getOppositeColor = (color: PieceColor): PieceColor =>
  color === "black" ? "white" : "black";
