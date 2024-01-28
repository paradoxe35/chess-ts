import {
  type ChessBoard,
  type PieceColor,
  type BoardType,
  type PieceMovesHistory,
  type BoardPosition,
  getPieceMoves,
} from ".";

import { getOppositeColor } from "@/utils/helpers";
import { getKingMoves } from "./moves/king";

export type TCheckmateParams = {
  board: ChessBoard;
  checkOn: PieceColor;
  boardType: BoardType;
  pieceMovesHistory: PieceMovesHistory;
};

export type TCheckmate = {
  checked: boolean;
  on: PieceColor;
  playerKingPosition: BoardPosition;
  excludedMoves: string[];
};

/**
 * Checkmate on passed piece color type
 * E.g if passed piece color is black then check if none white pieces don't check make the black king
 *
 * @param data
 * @returns
 */
export function hasCheckmate(params: TCheckmateParams): TCheckmate {
  const adversePieceColor = getOppositeColor(params.checkOn);
  const { adverseMoves, playerKingPosition } = getAllAdversePieceMoves(
    params,
    params.checkOn,
    adversePieceColor
  );

  const kingPiece = playerKingPosition?.piece;
  let excludedMoves: string[] = [];

  if (kingPiece && playerKingPosition) {
    const kingMoves = getKingMoves({
      board: params.board,
      boardType: params.boardType,
      history: params.pieceMovesHistory,
      piece: kingPiece,
      position: playerKingPosition.position,
    });

    excludedMoves = kingMoves.filter((move) => adverseMoves.includes(move));
  }

  return {
    checked: adverseMoves.includes(playerKingPosition?.position as string),
    playerKingPosition: playerKingPosition!,
    on: params.checkOn,
    excludedMoves,
  };
}

function getAllAdversePieceMoves(
  params: TCheckmateParams,
  playerColor: PieceColor,
  adversePieceColor: PieceColor
) {
  let playerKingPosition: BoardPosition | undefined;
  const adverseMoves: string[] = [];

  const boardWithoutKing = params.board.map((row) => {
    return row.map((cell) => {
      const piece = cell.piece;
      if (!piece) return cell;

      if (piece.color === playerColor && piece.type === "king") {
        playerKingPosition = { ...cell };
        cell.piece = undefined;
      }

      return cell;
    });
  });

  for (const row of boardWithoutKing) {
    for (const cell of row) {
      const piece = cell.piece;
      // Get all piece moves from adverser player
      if (piece && adversePieceColor === piece.color) {
        adverseMoves.push(
          ...getPieceMoves({
            board: params.board,
            boardType: params.boardType,
            history: params.pieceMovesHistory,
            piece: piece,
            position: cell.position,
          })
        );
      }
    }
  }

  return {
    playerKingPosition,
    adverseMoves,
  };
}
