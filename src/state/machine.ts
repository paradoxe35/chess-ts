import { createMachine, assign } from "xstate";
import {
  Board,
  BoardPiece,
  BoardType,
  PieceColor,
  PieceMovesHistory,
  createBoard,
  getPieceMoves,
} from "../chess";
import { nanoid } from "nanoid";

type TChessMachine = {
  context: {
    board: Board[];
    boardType: BoardType;
    player: PieceColor;
    pieceMove: { piece: BoardPiece; moves: string[] } | null;
    movesHistory: PieceMovesHistory;
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
      } & TChessMachine["context"])
    | {
        type: "chess.playing.setMove";
        movePosition: string;
      };
};

function defaultContext() {
  return {
    board: createBoard("empty", nanoid),
    boardType: "empty" as BoardType,
    player: "white" as PieceColor,
    pieceMove: null,
    movesHistory: {},
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
              // target: "move",
              actions: assign({
                pieceMove: ({ event, context }) => {
                  const moves = getPieceMoves({
                    piece: event.piece,
                    position: event.position,
                    board: context.board,
                    history: context.movesHistory,
                    boardType: context.boardType,
                  });

                  if (moves.length === 0) {
                    return null;
                  }

                  return {
                    piece: event.piece,
                    moves: moves,
                  };
                },
              }),
              guard: ({ context, event }) => {
                return context.player === event.piece.type;
              },
            },
          },
        },

        move: {
          on: {
            "chess.playing.setMove": {
              guard: ({ context, event }) => {
                const pieceMove = context.pieceMove;

                return pieceMove
                  ? pieceMove.moves.includes(event.movePosition)
                  : false;
              },
            },
          },
        },

        verify: {},
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
