import { createMachine, assign } from "xstate";
import {
  BoardType,
  PieceColor,
  createBoard,
  getPieceMoves,
  movePiece,
} from "../chess";
import { nanoid } from "nanoid";
import type { T_HistoryItem, PlayersPoints, TChessMachine } from "./types";
import cloneDeep from "lodash/cloneDeep";

const getOppositeColor = (color: PieceColor): PieceColor =>
  color === "black" ? "white" : "black";

function defaultContext(): TChessMachine["context"] {
  return {
    board: createBoard("empty", nanoid),
    boardType: "empty" as BoardType,
    playerType: null,
    pieceMove: null,
    histories: [],
    rolledBackHistory: false,
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
                  const history = context.selectedHistory;
                  const movesHistory = history?.pieceMoves || {};

                  const moves = getPieceMoves({
                    piece: event.piece,
                    position: event.position,
                    board: context.board,
                    history: movesHistory,
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
                const player = context.selectedHistory?.player || "white";

                if (player !== event.piece.type) {
                  return false;
                }

                const history = context.selectedHistory;
                const movesHistory = history?.pieceMoves || {};

                const moves = getPieceMoves({
                  piece: event.piece,
                  position: event.position,
                  board: context.board,
                  history: movesHistory,
                  boardType: context.boardType,
                });
                return moves.length > 0;
              },
            },

            "chess.playing.getMoves.history-rollback": {
              actions: assign({
                board: ({ event }) => {
                  return cloneDeep(event.historyItem.board);
                },

                lastMoves: ({ event }) => {
                  return {
                    piece: event.historyItem.piece,
                    oldPosition: event.historyItem.oldPosition,
                    newPosition: event.historyItem.newPosition,
                  };
                },

                selectedHistory: ({ event }) => {
                  return event.historyItem;
                },

                rolledBackHistory: ({ event, context }) => {
                  const lastItemHistory =
                    context.histories[context.histories.length - 1];

                  return event.historyItem !== lastItemHistory;
                },
              }),
            },
          },
        },

        move: {
          on: {
            "chess.playing.setMove": {
              target: "verify",
              actions: assign({
                histories: ({ context, event }) => {
                  const pieceMove = context.pieceMove!;

                  // ==================== Move Piece and update board ==============
                  const { newBoard, replacedPiece } = movePiece(
                    pieceMove.piece,
                    event.movePosition,
                    context.board
                  );

                  context.board = cloneDeep(newBoard);
                  context.replacedPiece = replacedPiece;

                  // ==================== Store History ==============
                  const lastItemHistory = context.histories[
                    context.histories.length - 1
                  ] as T_HistoryItem | undefined;

                  let newPointes: PlayersPoints | undefined =
                    lastItemHistory?.pointes;

                  // Store players points per history
                  if (lastItemHistory && context.replacedPiece) {
                    let lPointes = lastItemHistory.pointes;

                    if (!lPointes) {
                      lPointes = {
                        black: [],
                        white: [],
                      };
                    }

                    let piecePointes = lPointes[pieceMove.piece.type];

                    if (!piecePointes) {
                      piecePointes = [];
                    }

                    newPointes = {
                      ...lPointes,

                      [pieceMove.piece.type]: piecePointes.concat(
                        context.replacedPiece
                      ),
                    };
                  }

                  // Store pieces moves history
                  const pieceMoves = { ...(lastItemHistory?.pieceMoves || {}) };

                  if (!pieceMoves[pieceMove.piece.id!]) {
                    pieceMoves[pieceMove.piece.id!] = [event.movePosition];
                  } else {
                    pieceMoves[pieceMove.piece.id!] = pieceMoves[
                      pieceMove.piece.id!
                    ]?.concat(event.movePosition);
                  }

                  const historyItem: T_HistoryItem = {
                    board: newBoard,
                    oldPosition: pieceMove.position,
                    newPosition: event.movePosition,
                    piece: pieceMove.piece,
                    pointes: newPointes || ({} as PlayersPoints),
                    pieceMoves,
                    player:
                      pieceMove.piece.type === "black" ? "white" : "black",
                  };

                  // set selected History
                  context.selectedHistory = historyItem;

                  return context.histories.concat(historyItem);
                },
                lastMoves: ({ event, context }) => {
                  const pieceMove = context.pieceMove!;

                  return {
                    piece: pieceMove.piece,
                    oldPosition: pieceMove.position,
                    newPosition: event.movePosition,
                  };
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
