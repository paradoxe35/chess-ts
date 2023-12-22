import { cn } from "@/utils/cn";
import { ChessBoard } from "@/components";

export default function Chess() {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full h-full container mx-auto",
        "justify-center items-center"
      )}
    >
      <div className="chess-board w-full md:w-1/2">
        <ChessBoard />
      </div>
      <div className="chess-settings w-full md:w-1/2"></div>
    </div>
  );
}
