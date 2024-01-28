import { BoardPiece } from "@/chess";
import { getPieceImageSrc } from "@/assets/pieces";

export function PieceImg({
  piece,
  className,
  title,
}: {
  piece: BoardPiece;
  className?: string;
  title?: string;
}) {
  return (
    <img
      title={title}
      src={getPieceImageSrc(piece)}
      className={className}
      alt={piece.type}
    />
  );
}
