import { PieceColor } from "@/chess";
import { PlayerDetail, Players } from "@/state";

export function getPlayerPosition(
  player: PlayerDetail,
  players: Players
): "A" | "B" | null {
  switch (player.color) {
    case players.A?.color:
      return "A";

    case players.B?.color:
      return "B";

    default:
      return null;
  }
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
