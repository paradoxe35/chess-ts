import { Circle } from "@/components/ui/circle";
import { Indicator } from "@/components/ui/indicator";
import { Loader } from "@/components/ui/loader";
import { ChessGameContext, withPlayerColor } from "@/state";
import { cn } from "@/utils/cn";

export function Players() {
  const [computerLoading, selectedHistory, players, gameType] =
    ChessGameContext.useSelector((c) => [
      c.context.computerLoading,
      c.context.selectedHistory,
      c.context.players,
      c.context.gameType,
    ]);

  const player = withPlayerColor(selectedHistory?.player);

  if (!players) {
    return <></>;
  }

  return (
    <div className="flex justify-between border-b-2 border-b-slate-200/20 pb-3">
      {players.A && (
        <div className="flex flex-col justify-center items-center">
          <div className="relative w-10 h-10">
            <img
              className={cn(
                "w-full h-full rounded-full p-1 ring-2",
                players.A.color === player ? "ring-pink-500" : "ring-gray-500"
              )}
              src={players.A.image}
              alt={players.A.name}
            />

            {gameType === "online" && (
              <Indicator
                className={cn(
                  players.A.online ? "bg-green-400" : "bg-red-400",
                  "top-0 start-auto -right-1"
                )}
              />
            )}
          </div>
          <span className="capitalize inline-flex gap-1 items-center">
            {players.A.name} <Circle knight size={30} color={players.A.color} />
          </span>
        </div>
      )}

      {players.B && (
        <div className="flex flex-col items-center justify-center relative">
          {computerLoading && <Loader />}

          <div className="relative w-10 h-10">
            <img
              className={cn(
                "w-full h-full rounded-full p-1",
                !computerLoading && [
                  "ring-2",
                  players.B.color === player
                    ? "ring-pink-500"
                    : "ring-gray-500",
                ]
              )}
              src={players.B.image}
              alt={players.B.name}
            />

            {gameType === "online" && (
              <Indicator
                className={cn(
                  players.B.online ? "bg-green-400" : "bg-red-400",
                  "top-0 start-auto -right-1"
                )}
              />
            )}
          </div>

          <span className="capitalize inline-flex gap-1 items-center">
            {players.B.name} <Circle knight size={30} color={players.B.color} />
          </span>
        </div>
      )}
    </div>
  );
}
