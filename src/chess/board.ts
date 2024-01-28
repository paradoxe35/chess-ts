import { PieceColor, PieceType } from "./piece";

type BoardPositions = { [x: number]: string[] };

export const CHESS_COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H"];

const CHESS_POSITIONS = Array.from(new Array(CHESS_COLUMNS.length).keys())
  .reverse()
  .reduce((acc, v) => {
    acc[v + 1] = CHESS_COLUMNS.slice();
    return acc;
  }, {} as BoardPositions);

export type BoardPiece = {
  type: PieceType;
  color: PieceColor;
  id: string;
};

export type BoardPosition = {
  position: string;
  piece?: BoardPiece;
};

export type Board = BoardPosition[];

export type ChessBoard = Board[];

export type BoardType = "black->white" | "white->black" | "empty";

export const BOARD_TYPES: Exclude<BoardType, "empty">[] = [
  "black->white",
  "white->black",
];

export const CHESS_ROOT_ORDER: PieceType[] = [
  "rook",
  "knight",
  "bishop",
  "queen",
  "king",
  "bishop",
  "knight",
  "rook",
];

/**
 * Create Board
 *
 * @param boardType
 * @param createUid
 * @returns
 */
export function createBoard(
  boardType: BoardType,
  createUid?: () => string
): Board[] {
  if (!["black->white", "white->black", "empty"].includes(boardType)) {
    throw new Error("Unexpected board type value!");
  }

  return Object.keys(CHESS_POSITIONS)
    .map((key) => {
      const pNumber = +key;
      const pValue = CHESS_POSITIONS[pNumber];

      const getPieceColor = (): PieceColor => {
        if ([8, 7].includes(pNumber)) {
          return boardType === "white->black" ? "white" : "black";
        } else if ([2, 1].includes(pNumber)) {
          return boardType === "white->black" ? "black" : "white";
        }

        return "black";
      };

      const board: Board = pValue.map((position, i) => {
        let piece: BoardPiece | undefined;

        if (boardType === "empty") {
          return {
            position: position + pNumber,
          };
        }

        // Fullfil top root board piece
        if ([8, 1].includes(pNumber) && createUid) {
          piece = {
            type: CHESS_ROOT_ORDER[i],
            color: getPieceColor(),
            id: createUid(),
          };
        }

        // Fullfil bottom root board piece
        if ([7, 2].includes(pNumber) && createUid) {
          piece = {
            type: "pawn",
            color: getPieceColor(),
            id: createUid(),
          };
        }

        return {
          piece,
          position: position + pNumber,
        };
      });

      return board;
    })
    .reverse();
}

/**
 * Move piece
 *
 * @param piece
 * @param to
 * @param board
 */
export function movePiece(
  piece: BoardPiece,
  targetPosition: string,
  board: Board[]
) {
  const newBoard: Board[] = [];
  let replacedPiece: BoardPiece | undefined;

  board.forEach((column) => {
    column.forEach((box, i) => {
      if (box.piece?.id === piece.id) {
        column[i] = {
          position: box.position,
        };
      }

      if (box.position === targetPosition) {
        column[i] = {
          piece,
          position: box.position,
        };

        if (box.piece && piece.color !== box.piece.color) {
          replacedPiece = box.piece;
        }
      }
    });

    newBoard.push(column);
  });

  return {
    replacedPiece,
    newBoard,
  };
}

export function getPieceBoxById(id: string, board: ChessBoard) {
  return board.reduce((acc, column) => {
    if (!acc) {
      acc = column.find((box) => box.piece?.id === id);
    }

    return acc;
  }, undefined as undefined | BoardPosition);
}
