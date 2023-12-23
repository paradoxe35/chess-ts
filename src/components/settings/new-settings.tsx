import { cn } from "@/utils/cn";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function Title() {
  return (
    <div className="border-white/75 pb-2 my-10">
      <h1 className="text-white text-2xl font-bold border-b-2 ">Chess TS</h1>
    </div>
  );
}

export function NewSettings() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <Title />

      <div className="input">
        <Input placeholder="Your Name" type="text" />
      </div>

      {/* Type */}
      <div className="player-color flex items-center justify-center gap-2 my-5">
        <button
          className={cn(
            "w-10 h-10 bg-white rounded-full",
            "border-2 border-pink-500/80"
          )}
        />
        <button className="w-10 h-10 bg-black rounded-full" />
      </div>

      {/* Play buttons */}
      <div className="buttons flex flex-col mt-3 space-y-5">
        {/* Play online */}
        <Button variant="outline" type="button">
          🤝 Play online
        </Button>

        {/* Play computer */}
        <Button variant="secondary" type="button">
          🤖 Play with computer
        </Button>
      </div>
    </div>
  );
}
