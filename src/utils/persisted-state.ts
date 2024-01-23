import { Snapshot } from "xstate";

export const CHESS_ACTOR_PERSIST_KEY = (id?: string) =>
  "chess-game-" + (id || window.location.hash.replace("#/", ""));

export function getPersistedState() {
  let persistedState: Snapshot<unknown> | undefined = undefined;

  try {
    persistedState = JSON.parse(
      localStorage.getItem(CHESS_ACTOR_PERSIST_KEY()) || ""
    );
  } catch (_) {}

  return persistedState;
}
