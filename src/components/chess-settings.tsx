import { ChessGameContext } from "@/state";
import { ChessActivities } from "./settings/activities";
import { NewSettings } from "./settings/new-settings";

export function ChessSettings() {
  const playing = ChessGameContext.useSelector((c) => c.matches("playing"));
  return playing ? <ChessActivities /> : <NewSettings />;
}
