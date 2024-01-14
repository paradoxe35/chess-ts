import { BoardPiece } from "@/chess";
import { getPieceImageSrc } from "@/assets/pieces";

export function PieceImg({
  piece,
  className,
}: {
  piece: BoardPiece;
  className?: string;
}) {
  return <img src={getPieceImageSrc(piece)} className={className} />;
}
