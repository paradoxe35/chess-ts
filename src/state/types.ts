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

export type GHistory = {
  oldPosition: string;
  newPosition: string;
  piece: BoardPiece;
  board: Board[];
}[];

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
    player: PieceColor;

    pieceMove: {
      piece: BoardPiece;
      moves: string[];
      position: string;
    } | null;
    movesHistory: PieceMovesHistory;
    history: GHistory;
    winner: PieceColor | undefined;
    lastMoves: TLastMoves | undefined;
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
