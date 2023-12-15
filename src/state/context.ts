import { createActorContext } from "@xstate/react";
import { chessGameMachine } from ".";

export const ChessGameContext = createActorContext(chessGameMachine);
