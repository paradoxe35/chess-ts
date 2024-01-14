import { PieceColor } from "@/chess";
import { cn } from "@/utils/cn";
import { knight as bKnight } from "@/assets/pieces/black";
import { knight as wKnight } from "@/assets/pieces/white";

export function Circle(props: {
  size: number;
  color: PieceColor;
  knight?: boolean;
}) {
  return props.knight ? (
    <img
      src={props.color === "black" ? bKnight.src : wKnight.src}
      width={props.size}
      height={props.size}
      alt={props.color}
    />
  ) : (
    <div
      className={cn(
        "rounded-full",
        props.color === "white" ? "bg-white" : "bg-black"
      )}
      style={{ height: props.size, width: props.size }}
    />
  );
}
