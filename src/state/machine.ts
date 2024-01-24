import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import { createMachine, assign } from "xstate";
import { computerAIActor, computerAiSetMoveActor } from "./invokes";
import { BoardType, createBoard, getPieceMoves, movePiece } from "../chess";
import {
  type T_HistoryItem,
  type PlayersPoints,
  type TChessMachine,
  playerOrDefault,
  Chat,
} from "./types";
import { uniqueId } from "@/utils/unique-id";
import { getOppositeColor } from "@/utils/helpers";

function defaultContext(): TChessMachine["context"] {
  return {
    chats: [],
    histories: [],
    rolledBackHistory: false,
    board: createBoard("empty", uniqueId),
    boardType: "empty" as BoardType,
    gameType: null,
    pieceMove: null,
    lastMoves: undefined,
    winner: undefined,
  };
}

export const chessGameMachine = createMachine({
  id: "chess",
  initial: "start",
  types: {} as TChessMachine,
  on: {
    "chess.online.merge-data": {
      actions: assign({
        players: ({ event, context }) => {
          for (const key in event.context) {
            const $key = key as keyof TChessMachine["context"];
            // @ts-ignore
            context[$key] = event.context[$key];
          }

          return event.context.players;
        },
      }),
    },

    "chess.online.join-request": {
      actions: assign({
        joinRequest: ({ event }) => {
          if (event.request.request === "failed") {
            history.replaceState(null, "/", "");
            return undefined;
          }

          return event.request;
        },
      }),
    },
    reset: {
      actions: assign({ ...defaultContext() }),
    },
  },
  context: defaultContext,
  states: {
    start: {
      on: {
        "chess.settings.player-a": {
          target: "playing",
          actions: assign({
            boardType: ({ event }) => event.boardType,

            board: ({ event }) => createBoard(event.boardType, uniqueId),

            gameType: ({ event }) => event.gameType,

            playId: ({ event }) => event.playerA.id,

            players: ({ event }) => {
              return {
                A: event.playerA,
                B:
                  event.gameType === "computer"
                    ? {
                        id: uniqueId(),
                        computer: true,
                        name: event.gameType,
                        color: getOppositeColor(event.playerA.color),
                        image: "https://freesvg.org/img/1538298822.png",
                      }
                    : null,
              };
            },

            activePlayer: ({ event }) => event.playerA,
          }),

          guard: ({ context }) => {
            return !context.players && !context.gameType && !context.playId;
          },
        },

        "chess.settings.join": {
          target: "playing",
          actions: assign({
            players: ({ event, context }) => {
              if (!context.players) {
                return context.players;
              }

              return {
                ...context.players,
                B: {
                  ...event.playerB,
                  id: event.request.playerId,
                },
              };
            },

            activePlayer: ({ event }) => event.playerB,
          }),
          guard: ({ context }) => {
            return !!context.players && !!context.gameType && !!context.playId;
          },
        },
      },
    },

    playing: {
      initial: "getMoves",
      on: {
        "chess.playing.chat-message": {
          actions: assign({
            chats: ({ event, context }) => {
              const chats = context.chats || [];
              return chats.concat(event.chat);
            },
          }),
        },
      },
      entry: ({ context }) => {
        if (context.playId && !context.joinRequest) {
          history.replaceState(null, "", "#/" + context.playId);
        }
      },

      states: {
        getMoves: {
          invoke: {
            id: "computer-get-moves",
            src: computerAIActor,
            input: ({ context }) => ({
              board: context.board,
              players: context.players,
              gameType: context.gameType,
              selectedHistory: context.selectedHistory,
            }),
          },

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
                const player = playerOrDefault(context.selectedHistory?.player);

                if (
                  player !== event.piece.type ||
                  event.player.color !== player
                ) {
                  return false;
                }

                const _history = context.selectedHistory;
                const movesHistory = _history?.pieceMoves || {};

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

            "chess.playing.getMoves.computer-loading": {
              actions: assign({
                computerLoading: true,
              }),
            },

            "chess.playing.getMoves.computer-move": {
              target: "move",
              actions: assign({
                computerLoading: false,

                pieceMove: ({ event }) => {
                  return {
                    autoMove: true,
                    moves: event.move.moves,
                    piece: event.move.piece,
                    position: event.move.position,
                  };
                },

                chats: ({ event, context }) => {
                  const chats = context.chats || [];
                  if (!event.move.rationale || !context.players?.B) {
                    return chats;
                  }

                  const chat: Chat = {
                    message: event.move.rationale,
                    player: "B",
                  };

                  return chats.concat(chat);
                },
              }),
            },
          },
        },

        move: {
          invoke: {
            id: "computer-ai-set-move",
            src: computerAiSetMoveActor,
            input: ({ context }) => ({
              pieceMove: context.pieceMove,
              players: context.players,
              gameType: context.gameType,
            }),
          },
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

                  // ==================== Store History ==============
                  const lastItemHistory = context.histories[
                    context.histories.length - 1
                  ] as T_HistoryItem | undefined;

                  let newPointes: PlayersPoints | undefined =
                    lastItemHistory?.pointes;

                  // Store players points per history
                  if (lastItemHistory && replacedPiece) {
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

                      [pieceMove.piece.type]:
                        piecePointes.concat(replacedPiece),
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
                    id: uniqueId(),
                    board: newBoard,
                    oldPosition: pieceMove.position,
                    newPosition: event.movePosition,
                    piece: pieceMove.piece,
                    pointes: newPointes || ({} as PlayersPoints),
                    pieceMoves,
                    player: getOppositeColor(pieceMove.piece.type),
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
                const lHistory =
                  context.histories[context.histories.length - 1];

                const pieceMove = context.pieceMove || false;

                return (
                  pieceMove &&
                  pieceMove.moves.includes(event.movePosition) &&
                  isEqual(lHistory, context.selectedHistory)
                );
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
