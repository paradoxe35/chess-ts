import { cn } from "@/utils/cn";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { PieceColor } from "@/chess";
import { ChessGameContext } from "@/state";
import { DEFAULT_BOARD_TYPE } from "@/utils/constants";
import { uniqueId } from "@/utils/unique-id";
import { getOppositeColor } from "@/utils/helpers";

export function Title({ className }: { className?: string }) {
  return (
    <div className={cn("border-white/75 pb-2 my-10", className)}>
      <h1 className="text-white text-2xl font-bold border-b-2 ">Chess TS</h1>
    </div>
  );
}

export function NewSettings() {
  const players = ChessGameContext.useSelector((c) => c.context.players);
  const joinRequest = ChessGameContext.useSelector(
    (c) => c.context.joinRequest
  );
  const chessGame = ChessGameContext.useActorRef();

  const [color, setColor] = useState<PieceColor>("white");

  const [name, setName] = useState<string>("");

  const oppositePlayerAColor =
    players?.A?.color && getOppositeColor(players?.A?.color);

  const handleStart = (type: "computer" | "online") => {
    const $name = name.trim();
    if ($name.length <= 3) {
      return;
    }

    chessGame.send({
      type: "chess.settings.player-a",
      boardType: DEFAULT_BOARD_TYPE,
      playerA: {
        id: uniqueId(),
        name: $name,
        image: `https://i.pravatar.cc/250?u=${$name}`,
        color: color,
        computer: false,
      },
      gameType: type,
    });
  };

  const handleJoin = () => {
    const $name = name.trim();
    if ($name.length <= 3 || $name === players?.A?.name) {
      return;
    }

    if (joinRequest && oppositePlayerAColor) {
      chessGame.send({
        type: "chess.settings.join",
        request: joinRequest,
        playerB: {
          id: joinRequest.playerId,
          name: $name,
          image: `https://i.pravatar.cc/250?u=${$name}`,
          color: oppositePlayerAColor,
          computer: false,
        },
      });
    }
  };

  const hasJoinRequest = joinRequest && joinRequest.request !== "failed";

  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <Title />

      <div className="input">
        <Input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Type */}
      {!hasJoinRequest && <PlayerColors color={color} setColor={setColor} />}

      {hasJoinRequest && oppositePlayerAColor && (
        <PlayerColors color={oppositePlayerAColor} />
      )}

      {/* Play buttons */}
      {!hasJoinRequest && (
        <div className="buttons flex flex-col mt-3 space-y-5">
          {/* Play online */}
          <Button
            variant="outline"
            type="button"
            onClick={() => handleStart("online")}
          >
            🤝 Play online
          </Button>

          {/* Play computer */}
          <Button
            variant="secondary"
            type="button"
            onClick={() => handleStart("computer")}
          >
            🤖 Play with computer
          </Button>
        </div>
      )}

      {/* Join button */}
      {hasJoinRequest && (
        <div className="buttons flex flex-col mt-3 space-y-5">
          <Button variant="outline" type="button" onClick={handleJoin}>
            🤝 Play with {players?.A?.name}
          </Button>
        </div>
      )}
    </div>
  );
}

function PlayerColors({
  setColor,
  color,
}: {
  color: PieceColor;
  setColor?: Dispatch<SetStateAction<PieceColor>>;
}) {
  return (
    <div className="player-color flex items-center justify-center gap-2 my-5">
      <button
        onClick={() => setColor && setColor("white")}
        className={cn(
          "w-10 h-10 bg-white rounded-full",
          color === "white" && "border-2 border-pink-500/80"
        )}
      />
      <button
        onClick={() => setColor && setColor("black")}
        className={cn(
          "w-10 h-10 bg-black rounded-full",
          color === "black" && "border-2 border-pink-500/80"
        )}
      />
    </div>
  );
}
