import { ChessGameContext } from "@/state";

export function Overview() {
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
              className="w-10 h-10 rounded-full p-1 ring-2 ring-gray-500"
              src={players.A.image}
              alt={players.A.name}
            />
            <span>{players.A.name}</span>
          </div>
        )}

        {players.B && (
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-10 h-10 rounded-full p-1 ring-2 ring-gray-500"
              src={players.B.image}
              alt={players.B.name}
            />
            <span className="capitalize">{players.B.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
