import { PieceColor } from "@/chess";
import { PlayerDetail, PlayerType, Players } from "@/state";

export function getPlayerLetter(
  player: PlayerDetail,
  players: Players
): PlayerType | null {
  switch (player.color) {
    case players.A?.color:
      return "A";

    case players.B?.color:
      return "B";

    default:
      return null;
  }
}

export function getOppositePlayerLetter(letter: PlayerType): PlayerType {
  return letter === "A" ? "B" : "A";
}

export function getPlayerFromPieceColor(
  color: PieceColor,
  players: Players
): PlayerDetail | null {
  switch (color) {
    case players.A?.color:
      return players.A;

    case players.B?.color:
      return players.B;

    default:
      return null;
  }
}
