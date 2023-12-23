import { cn } from "@/utils/cn";
import { ChessBoard, ChessSettings } from "@/components";

export default function Chess() {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full px-3 md:px-0 container mx-auto",
        "justify-center items-center mt-10"
      )}
    >
      <div className="chess-board w-full md:w-1/2">
        <ChessBoard />
      </div>
      <div className="chess-settings w-full md:w-1/2 h-full flex flex-col">
        <ChessSettings />
      </div>
    </div>
  );
}
