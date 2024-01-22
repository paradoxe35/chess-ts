import { completion } from "litellm";
import {
  OLLAMA_MODEL,
  OLLAMA_SERVER_URL,
  OPENAI_API_KEY,
  OPENAI_MODEL,
} from "./constants";
import type { Board, PieceColor } from "@/chess";
import { PROMPT, SHORT_PROMPT } from "./prompts";
import { ComputerMoveResponse } from "@/state";

const MARKDOWN_EXTRACT_CONTENT_REGEX =
  /`{3}(?:[a-zA-Z0-9-_])?.*?\n([\s\S]*?)\n`{3}/;

export const getChessMoveFromAI = async (color: PieceColor, board: Board[]) => {
  const response = await completion({
    model: OPENAI_API_KEY ? OPENAI_MODEL : OLLAMA_MODEL,
    baseUrl: OPENAI_API_KEY ? undefined : OLLAMA_SERVER_URL,
    apiKey: OPENAI_API_KEY || undefined,
    stream: false,
    messages: [
      {
        role: "system",
        content: PROMPT(color),
      },
      {
        role: "user",
        content: JSON.stringify(board),
      },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    return null;
  }

  let match = (content.match(MARKDOWN_EXTRACT_CONTENT_REGEX) || [])[1];

  if (!match) {
    return null;
  }

  match = match.trim().replaceAll("\n", "");

  return JSON.parse(match) as ComputerMoveResponse;
};
