import { PieceMove, TChessMachine } from "..";
import { fromCallback } from "xstate";

type Input = {
  pieceMove: TChessMachine["context"]["pieceMove"];
  players: TChessMachine["context"]["players"];
};

export const computerAiSetMoveActor = fromCallback<any, Input>(
  ({ input, sendBack }) => {
    const player = input.players?.B;

    if (!input.pieceMove || !player || !input.pieceMove.autoMove) {
      return;
    }

    sendBack({
      type: "chess.playing.setMove",
      player: player,
      movePosition: input.pieceMove.moves[0],
    });
  }
);
