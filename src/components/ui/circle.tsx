import { PieceColor } from "@/chess";
import { cn } from "@/utils/cn";

export function Circle(props: { size: number; color: PieceColor }) {
  return (
    <div
      className={cn(
        "rounded-full",
        props.color === "white" ? "bg-white" : "bg-black"
      )}
      style={{ height: props.size, width: props.size }}
    />
  );
}
