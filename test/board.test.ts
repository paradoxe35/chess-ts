import { test, expect } from "vitest";
import { createBoard } from "../src/chess";

test("Should create a vilid board structure", () => {
  expect(createBoard()).toEqual([
    [
      {
        position: "H1",
      },
      {
        position: "H2",
      },
      {
        position: "H3",
      },
      {
        position: "H4",
      },
      {
        position: "H5",
      },
      {
        position: "H6",
      },
      {
        position: "H7",
      },
      {
        position: "H8",
      },
    ],
    [
      {
        position: "G1",
      },
      {
        position: "G2",
      },
      {
        position: "G3",
      },
      {
        position: "G4",
      },
      {
        position: "G5",
      },
      {
        position: "G6",
      },
      {
        position: "G7",
      },
      {
        position: "G8",
      },
    ],
    [
      {
        position: "F1",
      },
      {
        position: "F2",
      },
      {
        position: "F3",
      },
      {
        position: "F4",
      },
      {
        position: "F5",
      },
      {
        position: "F6",
      },
      {
        position: "F7",
      },
      {
        position: "F8",
      },
    ],
    [
      {
        position: "E1",
      },
      {
        position: "E2",
      },
      {
        position: "E3",
      },
      {
        position: "E4",
      },
      {
        position: "E5",
      },
      {
        position: "E6",
      },
      {
        position: "E7",
      },
      {
        position: "E8",
      },
    ],
    [
      {
        position: "D1",
      },
      {
        position: "D2",
      },
      {
        position: "D3",
      },
      {
        position: "D4",
      },
      {
        position: "D5",
      },
      {
        position: "D6",
      },
      {
        position: "D7",
      },
      {
        position: "D8",
      },
    ],
    [
      {
        position: "C1",
      },
      {
        position: "C2",
      },
      {
        position: "C3",
      },
      {
        position: "C4",
      },
      {
        position: "C5",
      },
      {
        position: "C6",
      },
      {
        position: "C7",
      },
      {
        position: "C8",
      },
    ],
    [
      {
        position: "B1",
      },
      {
        position: "B2",
      },
      {
        position: "B3",
      },
      {
        position: "B4",
      },
      {
        position: "B5",
      },
      {
        position: "B6",
      },
      {
        position: "B7",
      },
      {
        position: "B8",
      },
    ],
    [
      {
        position: "A1",
      },
      {
        position: "A2",
      },
      {
        position: "A3",
      },
      {
        position: "A4",
      },
      {
        position: "A5",
      },
      {
        position: "A6",
      },
      {
        position: "A7",
      },
      {
        position: "A8",
      },
    ],
  ]);
});
