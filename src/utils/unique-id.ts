import { nanoid } from "nanoid";

export function uniqueId(): string {
  const id = nanoid();

  return id.replaceAll("-", "");
}
