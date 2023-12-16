import { BoardPiece, Board, PieceMovesHistory, BoardType } from "..";

export type Params = {
  piece: NonNullable<BoardPiece>;
  position: string;
  board: Board[];
  history: PieceMovesHistory;
  boardType: BoardType;
};
