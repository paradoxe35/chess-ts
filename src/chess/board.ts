import { PieceColor, PieceType } from "./piece";

type BoardPositions = { [x: number]: string[] };

const CHESS_POSITIONS = Array.from(new Array(8).keys())
  .reverse()
  .reduce((acc, v) => {
    acc[v + 1] = ["A", "B", "C", "D", "E", "F", "G", "H"];
    return acc;
  }, {} as BoardPositions);

export type BoardPiece = {
  value: PieceType;
  type: PieceColor;
  id?: string;
};

export type BoardPosition = {
  position: string;
  piece?: BoardPiece;
};

export type Board = BoardPosition[];

export type BoardType = "black->white" | "white->black" | "empty";

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
        if ([8, 1].includes(pNumber)) {
          piece = {
            value: CHESS_ROOT_ORDER[i],
            type: getPieceColor(),
            id: createUid ? createUid() : undefined,
          };
        }

        // Fullfil bottom root board piece
        if ([7, 2].includes(pNumber)) {
          piece = {
            value: "pawn",
            type: getPieceColor(),
            id: createUid ? createUid() : undefined,
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
