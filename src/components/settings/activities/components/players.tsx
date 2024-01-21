import { Circle } from "@/components/ui/circle";
import { Loader } from "@/components/ui/loader";
import { ChessGameContext, playerOrDefault } from "@/state";
import { cn } from "@/utils/cn";

export function Players() {
  const computerLoading = ChessGameContext.useSelector(
    (c) => c.context.computerLoading
  );
  const selectedHistory = ChessGameContext.useSelector(
    (c) => c.context.selectedHistory
  );
  const players = ChessGameContext.useSelector((c) => c.context.players);

  const player = playerOrDefault(selectedHistory?.player);

  if (!players) {
    return <></>;
  }

  return (
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
            {players.A.name} <Circle knight size={30} color={players.A.color} />
          </span>
        </div>
      )}

      {players.B && (
        <div className="flex flex-col items-center justify-center relative">
          {computerLoading && <Loader />}

          <img
            className={cn(
              "w-10 h-10 rounded-full p-1",
              !computerLoading && [
                "ring-2",
                players.B.color === player ? "ring-pink-500" : "ring-gray-500",
              ]
            )}
            src={players.B.image}
            alt={players.B.name}
          />

          <span className="capitalize inline-flex gap-1 items-center">
            {players.B.name} <Circle knight size={30} color={players.B.color} />
          </span>
        </div>
      )}
    </div>
  );
}
