import {
  PieceColor,
  BoardPiece,
  Board,
  BoardType,
  PieceMovesHistory,
} from "@/chess";

export type GameType = "computer" | "online" | null;

export type PlayerDetail = {
  id: string;
  name: string;
  image?: string;
  online?: boolean;
  computer: boolean;
  color: PieceColor;
};

export type Players = {
  [x in "A" | "B"]: PlayerDetail | null;
};

export const playerOrDefault = (player?: PieceColor) => player || "white";

export type PlayersPoints = {
  [X in PieceColor]: BoardPiece[];
};

export type T_HistoryItem = {
  id: string;
  oldPosition: string;
  newPosition: string;
  piece: BoardPiece;
  board: Board[];
  pointes: PlayersPoints;
  pieceMoves: PieceMovesHistory;
  player: PieceColor;
};

export type GHistory = T_HistoryItem[];

export type TLastMoves = {
  oldPosition: string;
  newPosition: string;
  piece: BoardPiece;
};

export type ComputerMoveResponse = {
  piece: string | BoardPiece;
  currentPosition: string;
  targetPosition: string;
  rationale: string;
};

export type PieceMove = {
  piece: BoardPiece;
  moves: string[];
  position: string;
  autoMove?: boolean;
  rationale?: string;
};

export type Chat = {
  player: "A" | "B";
  message: string;
};

export type JoinRequest = {
  playerId: string;
  request: "idle" | "open" | "closed";
};

export type TChessMachine = {
  context: {
    board: Board[];
    chats: Chat[];
    boardType: BoardType;
    computerLoading?: boolean;

    joinRequest?: JoinRequest;

    playId?: string;
    players?: Players;
    activePlayer?: PlayerDetail;
    gameType: GameType;

    pieceMove: PieceMove | null;

    histories: GHistory;
    selectedHistory?: T_HistoryItem;
    rolledBackHistory: boolean;

    winner: PieceColor | undefined;
    lastMoves: TLastMoves | undefined;
  };
  events:
    | {
        type: "chess.online.merge-data";
        context: TChessMachine["context"];
      }
    | {
        type: "chess.settings.player-a";
        boardType: BoardType;
        gameType: GameType;
        playerA: PlayerDetail;
      }
    | {
        type: "chess.online.join-request";
        request: JoinRequest;
      }
    | {
        type: "chess.settings.join";
      }
    | {
        type: "chess.playing.getMoves";
        position: string;
        piece: NonNullable<BoardPiece>;
        player: PlayerDetail;
      }
    | {
        type: "chess.playing.getMoves.history-rollback";
        historyItem: T_HistoryItem;
      }
    | {
        type: "chess.playing.getMoves.computer-loading";
      }
    | {
        type: "chess.playing.getMoves.computer-move";
        move: PieceMove;
      }
    | ({
        type: "reset";
      } & TChessMachine["context"])
    | {
        type: "chess.playing.setMove";
        movePosition: string;
        player: PlayerDetail;
      }
    | {
        type: "chess.playing.setMove.reset";
      }
    | {
        type: "chess.playing.chat-message";
        chat: Chat;
      };
};
