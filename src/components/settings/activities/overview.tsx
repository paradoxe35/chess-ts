import { Circle } from "@/components/ui/circle";
import { ChessGameContext } from "@/state";
import { cn } from "@/utils/cn";

export function Overview() {
  const player = ChessGameContext.useSelector((c) => c.context.player);
  const players = ChessGameContext.useSelector((c) => c.context.players);

  if (!players) {
    return <></>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between border-b-2 border-b-slate-200/20 pb-3">
        {players.A && (
          <div className="flex flex-col justify-center items-center">
            <img
              className={cn(
                "w-10 h-10 rounded-full p-1 ring-2",
                players.A.color === player ? "ring-pink-500" : "ring-gray-500"
              )}
              src={players.A.image}
              alt={players.A.name}
            />
            <span className="capitalize inline-flex gap-1 items-center">
              {players.A.name} <Circle size={15} color={players.A.color} />
            </span>
          </div>
        )}

        {players.B && (
          <div className="flex flex-col items-center justify-center">
            <img
              className={cn(
                "w-10 h-10 rounded-full p-1 ring-2",
                players.B.color === player ? "ring-pink-500" : "ring-gray-500"
              )}
              src={players.B.image}
              alt={players.B.name}
            />
            <span className="capitalize inline-flex gap-1 items-center">
              {players.B.name} <Circle size={15} color={players.B.color} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
