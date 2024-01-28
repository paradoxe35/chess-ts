import {
  type ChessBoard,
  type PieceColor,
  type BoardType,
  type PieceMovesHistory,
  type BoardPosition,
  getPieceMoves,
} from ".";

import { getOppositeColor } from "@/utils/helpers";

export type TCheckmateParams = {
  board: ChessBoard;
  checkOn: PieceColor;
  boardType: BoardType;
  pieceMovesHistory: PieceMovesHistory;
};

export type TCheckmate = {
  checkmate: boolean;
  on: PieceColor;
  playerKingPosition: BoardPosition;
};

/**
 * Checkmate on passed piece color type
 * E.g if passed piece color is black then check if none white pieces don't check make the black king
 *
 * @param data
 * @returns
 */
export function hasCheckmate(data: TCheckmateParams): TCheckmate {
  const adversePieceColor = getOppositeColor(data.checkOn);
  const { adverseMoves, playerKingPosition } = getAllAdversePieceMoves(
    data,
    data.checkOn,
    adversePieceColor
  );

  return {
    checkmate: adverseMoves.includes(playerKingPosition?.position as string),
    playerKingPosition: playerKingPosition!,
    on: data.checkOn,
  };
}

function getAllAdversePieceMoves(
  params: TCheckmateParams,
  playerColor: PieceColor,
  adversePieceColor: PieceColor
) {
  let playerKingPosition: BoardPosition | undefined;
  const adverseMoves: string[] = [];

  for (const column of params.board) {
    for (const box of column) {
      const piece = box.piece;

      if (piece) {
        // current player king piece position
        if (piece.color === playerColor && piece.type === "king") {
          playerKingPosition = box;
        }

        // Get all piece moves from adverser player
        if (adversePieceColor === piece.color) {
          adverseMoves.push(
            ...getPieceMoves({
              board: params.board,
              boardType: params.boardType,
              history: params.pieceMovesHistory,
              piece: piece,
              position: box.position,
            })
          );
        }
      }
    }
  }

  return {
    playerKingPosition,
    adverseMoves,
  };
}
