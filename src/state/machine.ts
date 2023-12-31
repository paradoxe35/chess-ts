import { createMachine, assign } from "xstate";
import {
  Board,
  BoardPiece,
  BoardType,
  PieceColor,
  PieceMovesHistory,
  createBoard,
  getPieceMoves,
  movePiece,
} from "../chess";
import { nanoid } from "nanoid";

type PlayerType = "computer" | "online" | null;
type PlayerDetail = {
  name: string;
  image?: string;
  computer: boolean;
  color: PieceColor;
};
type Players = {
  [x in "A" | "B"]: PlayerDetail | null;
};

type TChessMachine = {
  context: {
    board: Board[];
    boardType: BoardType;

    playId?: string;
    players?: Players;
    playerType: PlayerType;
    player: PieceColor;

    pieceMove: { piece: BoardPiece; moves: string[] } | null;
    movesHistory: PieceMovesHistory;
    history: Board[][];
    winner: PieceColor | undefined;
  };
  events:
    | {
        type: "chess.settings";
        boardType: BoardType;
        playerType: PlayerType;
        player: PlayerDetail;
      }
    | {
        type: "chess.settings.join";
      }
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
      }
    | {
        type: "chess.playing.setMove.reset";
      };
};

function defaultContext(): TChessMachine["context"] {
  return {
    board: createBoard("empty", nanoid),
    boardType: "empty" as BoardType,
    playerType: null,
    player: "white" as PieceColor,
    pieceMove: null,
    movesHistory: {},
    history: [],
    winner: undefined,
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

            playerType: ({ event }) => event.playerType,

            playId: ({ event }) =>
              event.playerType === "computer" ? "computer" : nanoid(),

            players: ({ event }) => ({ A: event.player, B: null }),
          }),

          guard: ({ context }) => {
            return !context.players && !context.playerType && !context.playId;
          },
        },

        "chess.settings.join": {},
      },
    },
    playing: {
      initial: "getMoves",
      entry: ({ context }) => {
        if (context.playId) {
          history.replaceState(null, "", "#/" + context.playId);
        }
      },
      states: {
        getMoves: {
          on: {
            "chess.playing.getMoves": {
              target: "move",
              actions: assign({
                pieceMove: ({ event, context }) => {
                  const moves = getPieceMoves({
                    piece: event.piece,
                    position: event.position,
                    board: context.board,
                    history: context.movesHistory,
                    boardType: context.boardType,
                  });

                  return {
                    piece: event.piece,
                    moves: moves,
                  };
                },
              }),
              guard: ({ context, event }) => {
                if (context.player !== event.piece.type) {
                  return false;
                }

                const moves = getPieceMoves({
                  piece: event.piece,
                  position: event.position,
                  board: context.board,
                  history: context.movesHistory,
                  boardType: context.boardType,
                });
                return moves.length > 0;
              },
            },
          },
        },

        move: {
          on: {
            "chess.playing.setMove": {
              target: "verify",
              actions: assign({
                board: ({ event, context }) => {
                  const pieceMove = context.pieceMove!;

                  return movePiece(
                    pieceMove.piece,
                    event.movePosition,
                    context.board
                  );
                },
                movesHistory: ({ event, context }) => {
                  const pieceMove = context.pieceMove!;
                  const movesHistory = context.movesHistory;

                  if (!movesHistory[pieceMove.piece.id!]) {
                    movesHistory[pieceMove.piece.id!] = [event.movePosition];
                  } else {
                    movesHistory[pieceMove.piece.id!]?.push(event.movePosition);
                  }

                  return movesHistory;
                },
              }),
              guard: ({ context, event }) => {
                const pieceMove = context.pieceMove;

                return pieceMove
                  ? pieceMove.moves.includes(event.movePosition)
                  : false;
              },
            },

            "chess.playing.setMove.reset": {
              target: "getMoves",
              actions: assign({
                pieceMove: () => {
                  return null;
                },
              }),
            },
          },
        },

        verify: {
          always: {
            target: "getMoves",
            actions: assign({
              player: ({ context }) => {
                return context.player === "black" ? "white" : "black";
              },
              pieceMove: () => {
                return null;
              },
              winner: () => {
                // Winner logic here
                return undefined;
              },
            }),
          },
        },
      },
      history: "deep",
      always: {
        guard: ({ context }) => {
          return context.boardType !== "empty" && context.winner === undefined;
        },
      },
    },
  },
});
