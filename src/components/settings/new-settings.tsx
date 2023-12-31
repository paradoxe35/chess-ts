import { cn } from "@/utils/cn";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { PieceColor } from "@/chess";
import { ChessGameContext } from "@/state";

export function Title({ className }: { className?: string }) {
  return (
    <div className={cn("border-white/75 pb-2 my-10", className)}>
      <h1 className="text-white text-2xl font-bold border-b-2 ">Chess TS</h1>
    </div>
  );
}

export function NewSettings() {
  const chessGame = ChessGameContext.useActorRef();

  const [color, setColor] = useState<PieceColor>("white");

  const [name, setName] = useState<string>("");

  const handleStart = (type: "computer" | "online") => {
    if (name.length <= 3) {
      return;
    }

    chessGame.send({
      type: "chess.settings",
      boardType: "black->white",
      player: {
        name: name,
        image: `https://i.pravatar.cc/250?u=${name}`,
        color: color,
        computer: false,
      },
      playerType: type,
    });
  };

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
      <div className="player-color flex items-center justify-center gap-2 my-5">
        <button
          onClick={() => setColor("white")}
          className={cn(
            "w-10 h-10 bg-white rounded-full",
            color === "white" && "border-2 border-pink-500/80"
          )}
        />
        <button
          onClick={() => setColor("black")}
          className={cn(
            "w-10 h-10 bg-black rounded-full",
            color === "black" && "border-2 border-pink-500/80"
          )}
        />
      </div>

      {/* Play buttons */}
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
    </div>
  );
}
