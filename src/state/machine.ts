import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import { createMachine, assign } from "xstate";
import { computerAIActor, computerAiSetMoveActor } from "./invokes";
import { BoardType, createBoard, getPieceMoves, movePiece } from "../chess";
import {
  type T_HistoryItem,
  type PlayersPoints,
  type TChessMachine,
  withPlayerColor,
  TChat,
} from "./types";
import { uniqueId } from "@/utils/unique-id";
import { getOppositeColor } from "@/utils/helpers";
import { requestForCheckmate } from "@/workers/checkmate";
import {
  invalidPieceMovesOnCheckmate,
  invalidTargetMoveOnCheckmate,
} from "@/chess/helpers";

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
    playId: undefined,
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
            return undefined;
          }

          return event.request;
        },
      }),
    },
    "chess.reset": {
      actions: assign({ ...defaultContext() }),
    },

    "chess.players.online": {
      actions: assign({
        players: ({ event, context }) => {
          if (context.players && context.players[event.player]) {
            //@ts-ignore
            context.players[event.player].online = event.online;
          }

          return context.players;
        },
      }),
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
        "chess.playing.checkmate": {
          actions: assign({
            checkmate: ({ event }) => {
              return event.checkmate;
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

          entry: async ({ context, self }) => {
            const checkmate = context.checkmate;
            const selectedHistory = context.selectedHistory;

            if (
              !selectedHistory ||
              (checkmate && checkmate.on === selectedHistory.player)
            ) {
              return;
            }

            // Request for checkmate from worker
            const checkmateValue = await requestForCheckmate({
              board: context.board,
              boardType: context.boardType,
              checkOn: selectedHistory.player,
              pieceMovesHistory: selectedHistory.pieceMovesHistory,
            });

            // Store checkmate
            self.send({
              type: "chess.playing.checkmate",
              checkmate: checkmateValue,
            });
          },

          on: {
            "chess.playing.getMoves": {
              target: "move",
              actions: assign({
                pieceMove: ({ event, context }) => {
                  const history = context.selectedHistory;
                  const movesHistory = history?.pieceMovesHistory || {};

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
                const playerColor = withPlayerColor(
                  context.selectedHistory?.player
                );

                // Only on pieces color that correspond to current player turn
                if (
                  playerColor !== event.piece.color ||
                  event.player.color !== playerColor
                ) {
                  return false;
                }

                // If checkmate cannot player any other piece expect move king
                const checkmate = context.checkmate;
                if (
                  invalidPieceMovesOnCheckmate(
                    context.activePlayer,
                    checkmate,
                    event.piece
                  )
                ) {
                  return false;
                }

                const _history = context.selectedHistory;
                const movesHistory = _history?.pieceMovesHistory || {};

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

                  const chat: TChat = {
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

                    let piecePointes = lPointes[pieceMove.piece.color];

                    if (!piecePointes) {
                      piecePointes = [];
                    }

                    newPointes = {
                      ...lPointes,

                      [pieceMove.piece.color]:
                        piecePointes.concat(replacedPiece),
                    };
                  }

                  // Store pieces moves history
                  const pieceMovesHistory = {
                    ...(lastItemHistory?.pieceMovesHistory || {}),
                  };

                  if (!pieceMovesHistory[pieceMove.piece.id!]) {
                    pieceMovesHistory[pieceMove.piece.id!] = [
                      event.movePosition,
                    ];
                  } else {
                    pieceMovesHistory[pieceMove.piece.id!] = pieceMovesHistory[
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
                    pieceMovesHistory,
                    player: getOppositeColor(pieceMove.piece.color),
                  };

                  // set selected History
                  context.selectedHistory = historyItem;

                  // Array mutation necessary
                  context.histories.push(historyItem);

                  return context.histories;
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

                // Prevent move if checkmate and the target move is excluded
                const checkmate = context.checkmate;
                if (
                  invalidTargetMoveOnCheckmate(
                    checkmate,
                    context.pieceMove,
                    event.movePosition
                  )
                ) {
                  return false;
                }

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
