import { ChessGameContext, withPlayerColor } from "@/state";
import { useEffect } from "react";
import { toast } from "sonner";

function MovePieceAlert() {
  const context = ChessGameContext.useSelector((c) => c.context);

  const turnPlayerColor = withPlayerColor(context.selectedHistory?.player);
  const activePlayerColor = context.activePlayer?.color;
  const hasCheckmate =
    context.checkmate?.checked && context.checkmate.on === turnPlayerColor;

  useEffect(() => {
    const check =
      turnPlayerColor &&
      activePlayerColor &&
      activePlayerColor === turnPlayerColor &&
      !context.rolledBackHistory;

    if (check && hasCheckmate === false) {
      toast.info("Move your piece");
    }

    if (check && hasCheckmate) {
      toast.warning("You're checkmated");
    }
  }, [
    turnPlayerColor,
    activePlayerColor,
    context.rolledBackHistory,
    hasCheckmate,
  ]);

  return <></>;
}

export function Alerts() {
  return (
    <>
      <MovePieceAlert />
    </>
  );
}
