export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4-1106-preview";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "";
export const OLLAMA_SERVER_URL = process.env.OLLAMA_SERVER_URL;

export const DEFAULT_BOARD_TYPE = "black->white";

export const PEER_HOST = process.env.NEXT_PUBLIC_PEER_HOST || undefined;
export const PEER_PORT = process.env.NEXT_PUBLIC_PEER_PORT
  ? +process.env.NEXT_PUBLIC_PEER_PORT
  : undefined;

export const PEER_SECURE =
  process.env.NEXT_PUBLIC_PEER_SECURE === "true" ? true : undefined;
