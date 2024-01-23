import { createActorContext } from "@xstate/react";
import { chessGameMachine } from ".";
import { getPersistedState } from "@/utils/persisted-state";

export const ChessGameContext = createActorContext(chessGameMachine, {
  snapshot: getPersistedState(),
});
