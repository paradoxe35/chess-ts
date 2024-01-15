import { createMachine, assign } from "xstate";
import {
  BoardType,
  PieceColor,
  createBoard,
  getPieceMoves,
  movePiece,
} from "../chess";
import { nanoid } from "nanoid";
import type { PlayersPoints, TChessMachine } from "./types";

const getOppositeColor = (color: PieceColor): PieceColor =>
  color === "black" ? "white" : "black";

function defaultContext(): TChessMachine["context"] {
  return {
    board: createBoard("empty", nanoid),
    boardType: "empty" as BoardType,
    playerType: null,
    player: "white" as PieceColor,
    pieceMove: null,
    movesHistory: {},
    history: [],
    lastMoves: undefined,
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

            playId: () => nanoid(),

            players: ({ event }) => {
              return {
                A: event.playerA,
                B:
                  event.playerType === "computer"
                    ? {
                        name: event.playerType,
                        color: getOppositeColor(event.playerA.color),
                        computer: true,
                        image: "https://freesvg.org/img/1538298822.png",
                      }
                    : null,
              };
            },

            activePlayer: ({ event }) => event.playerA,
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
                    position: event.position,
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
                  const { newBoard, replacedPiece } = movePiece(
                    pieceMove.piece,
                    event.movePosition,
                    context.board
                  );

                  context.replacedPiece = replacedPiece;

                  return newBoard;
                },
                history: ({ context, event }) => {
                  const pieceMove = context.pieceMove!;
                  const lastItemHistory =
                    context.history[context.history.length - 1];

                  let newPointes: PlayersPoints | undefined =
                    lastItemHistory.pointes;

                  // Store players points per history
                  if (lastItemHistory && context.replacedPiece) {
                    let lPointes = lastItemHistory.pointes;

                    if (!lPointes) {
                      lPointes = {
                        black: [],
                        white: [],
                      };
                    }

                    const piecePointes = lPointes[pieceMove.piece.type];

                    newPointes = {
                      ...lPointes,

                      [pieceMove.piece.type]: piecePointes.concat(
                        context.replacedPiece
                      ),
                    };
                  }

                  return [
                    ...context.history,
                    {
                      oldPosition: pieceMove.position,
                      newPosition: event.movePosition,
                      piece: pieceMove.piece,
                      board: context.board,
                      pointes: newPointes,
                    },
                  ];
                },
                lastMoves: ({ event, context }) => {
                  const pieceMove = context.pieceMove!;
                  return {
                    piece: pieceMove.piece,
                    oldPosition: pieceMove.position,
                    newPosition: event.movePosition,
                  };
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
