// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Board, PieceColor } from "@/chess";
import type { ComputerMoveResponse } from "@/state";
import type { NextApiRequest, NextApiResponse } from "next";

import { getChessMoveFromAI } from "@/utils/ai";

type Data = {
  data: ComputerMoveResponse | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ data: null });
    return;
  }

  const body = req.body as {
    board: Board[];
    color: PieceColor;
  };

  const move = await getChessMoveFromAI(body.color, body.board);

  res.status(200).json({ data: move });
}
