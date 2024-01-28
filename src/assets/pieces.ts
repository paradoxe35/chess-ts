import { BoardPiece } from "@/chess";

const icons = {
  black: require("./pieces/black"),
  white: require("./pieces/white"),
};

export function getPieceImageSrc(piece: BoardPiece) {
  const svg_icons = icons[piece.color];
  const icon = svg_icons[piece.type];

  return icon.src as string;
}

export default icons;
