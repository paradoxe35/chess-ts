import { nanoid } from "nanoid";

export function uniqueId(): string {
  let id = nanoid();

  for (const symbol of ["-", "_"]) {
    if (id.startsWith(symbol)) {
      id = id.substring(1);
    }

    if (id.endsWith(symbol)) {
      id = id.substring(0, id.length - 1);
    }
  }

  return id;
}
