import { fromCallback } from "xstate";
import {
  ComputerMoveResponse,
  PieceMove,
  TChessMachine,
  withPlayerColor,
} from "..";
import { getPieceBoxById, getPieceMoves } from "@/chess";
import { DEFAULT_BOARD_TYPE } from "@/utils/constants";

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
    const playerColor = withPlayerColor(input.selectedHistory?.player);

    if (playerB?.color !== playerColor || !playerB.computer) {
      return;
    }

    sendBack({ type: "chess.playing.getMoves.computer-loading" });

    const request = () => {
      return fetch("/api/ai", {
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
          const responseData = res.data;

          const id =
            typeof responseData?.piece === "string"
              ? responseData.piece
              : responseData?.piece.id;

          if (!id || !responseData) {
            return Promise.reject("Invalid request");
          }

          const pieceBox = getPieceBoxById(id, input.board);

          if (!pieceBox?.piece) {
            return Promise.reject("Invalid request");
          }

          const pieceMoves = input.selectedHistory?.pieceMoves || {};

          const moves = getPieceMoves({
            boardType: DEFAULT_BOARD_TYPE,
            board: input.board,
            history: pieceMoves,
            piece: pieceBox.piece,
            position: pieceBox.position,
          });

          const validMove = moves.includes(responseData.targetPosition);

          if (!validMove) {
            return Promise.reject("Invalid request");
          }

          sendBack({
            type: "chess.playing.getMoves.computer-move",
            move: <PieceMove>{
              position: responseData.currentPosition,
              moves: [responseData.targetPosition],
              piece: pieceBox.piece,
              rationale: responseData.rationale,
              autoMove: true,
            },
          });
        });
    };

    (async () => {
      for (const _ of [1, 2, 3]) {
        try {
          await request();
          break;
        } catch (_) {
          continue;
        }
      }
    })();
  }
);
