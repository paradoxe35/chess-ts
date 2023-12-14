import { test, expect } from "vitest";
import { PIECE_POINTS } from "../src/chess";

test("Should match defined chess piece points", () => {
  expect(PIECE_POINTS).toEqual({
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
  });
});
