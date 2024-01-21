import { fromCallback } from "xstate";
import { ComputerMoveResponse, TChessMachine, playerOrDefault } from ".";

type Input = {
  board: TChessMachine["context"]["board"];
  gameType: TChessMachine["context"]["gameType"];
  players: TChessMachine["context"]["players"];
  selectedHistory: TChessMachine["context"]["selectedHistory"];
};

type ApiResponse = {
  data: ComputerMoveResponse | null;
};

export const computerAIActor = fromCallback<any, Input>(
  ({ input, sendBack }) => {
    if (input.gameType !== "computer") {
      return;
    }

    const playerB = input.players?.B || undefined;
    const playerColor = playerOrDefault(input.selectedHistory?.player);

    if (playerB?.color !== playerColor || !playerB.computer) {
      return;
    }

    sendBack({ type: "chess.playing.getMoves.computer-loading" });

    fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        board: input.board,
        color: playerB.color,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        console.log(res);
      });
  }
);
