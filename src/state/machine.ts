import { createMachine, assign } from "xstate";
import {
  Board,
  BoardPiece,
  BoardType,
  PieceColor,
  createBoard,
  getPieceMoves,
} from "../chess";
import { nanoid } from "nanoid";

type TChessMachine = {
  context: {
    board: Board[];
    boardType: BoardType;
    player: PieceColor;
    moves: string[];
  };
  events:
    | { type: "chess.settings"; boardType: BoardType }
    | {
        type: "chess.playing.getMoves";
        position: string;
        piece: NonNullable<BoardPiece>;
      }
    | ({
        type: "reset";
      } & TChessMachine["context"]);
};

function defaultContext() {
  return {
    board: createBoard("empty", nanoid),
    boardType: "empty" as BoardType,
    player: "white" as PieceColor,
    moves: [],
  };
}

export const chessGameMachine = createMachine({
  id: "chess",
  initial: "start",
  types: {} as TChessMachine,
  on: {
    reset: {
      actions: assign({ ...defaultContext() }),
    },
  },
  context: defaultContext,
  states: {
    start: {
      on: {
        "chess.settings": {
          target: "playing",
          actions: assign({
            boardType: ({ event }) => event.boardType,
            board: ({ event }) => createBoard(event.boardType, nanoid),
          }),
        },
      },
    },
    playing: {
      initial: "getMoves",
      states: {
        getMoves: {
          on: {
            "chess.playing.getMoves": {
              target: "move",
              actions: assign({
                moves: ({ event, context }) =>
                  getPieceMoves(event.piece, event.position, context.board),
              }),
              guard: ({ context, event }) => {
                return context.player === event.piece.type;
              },
            },
          },
        },

        move: {},
      },
      history: "deep",
      always: {
        guard: ({ context }) => {
          return context.boardType !== "empty";
        },
      },
    },
  },
});
