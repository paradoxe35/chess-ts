import { createActorContext } from "@xstate/react";
import { chessGameMachine } from ".";
import { Snapshot } from "xstate";

export const CHESS_ACTOR_PERSIST_KEY = (id?: string) =>
  "chess-game-" + (id || window.location.hash.replace("#/", ""));

let persistedState: Snapshot<unknown> | undefined = undefined;

try {
  persistedState = JSON.parse(
    localStorage.getItem(CHESS_ACTOR_PERSIST_KEY()) || ""
  );
} catch (error) {
  console.error(error);
}

export const ChessGameContext = createActorContext(chessGameMachine, {
  snapshot: persistedState,
});
