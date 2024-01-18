import {
  PieceColor,
  BoardPiece,
  Board,
  BoardType,
  PieceMovesHistory,
} from "@/chess";

export type PlayerType = "computer" | "online" | null;
export type PlayerDetail = {
  name: string;
  image?: string;
  computer: boolean;
  color: PieceColor;
};
type Players = {
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

export type TChessMachine = {
  context: {
    board: Board[];
    boardType: BoardType;

    playId?: string;
    players?: Players;
    activePlayer?: PlayerDetail;
    playerType: PlayerType;

    pieceMove: {
      piece: BoardPiece;
      moves: string[];
      position: string;
    } | null;

    histories: GHistory;
    selectedHistory?: T_HistoryItem;
    rolledBackHistory: boolean;

    winner: PieceColor | undefined;
    lastMoves: TLastMoves | undefined;

    replacedPiece?: BoardPiece | undefined;
  };
  events:
    | {
        type: "chess.settings";
        boardType: BoardType;
        playerType: PlayerType;
        playerA: PlayerDetail;
      }
    | {
        type: "chess.settings.join";
      }
    | {
        type: "chess.playing.getMoves";
        position: string;
        piece: NonNullable<BoardPiece>;
      }
    | {
        type: "chess.playing.getMoves.history-rollback";
        historyItem: T_HistoryItem;
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
