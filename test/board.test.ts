import { test, expect, describe, it } from "vitest";
import { CHESS_ROOT_ORDER, createBoard } from "../src/chess";

test("Should have a valid default chess order", () => {
  expect(CHESS_ROOT_ORDER).toEqual([
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ]);
});

describe("Create board", () => {
  it("Should create white->black board type", () => {
    expect(createBoard("white->black")).toEqual([
      [
        {
          piece: {
            value: "rook",
            type: "white",
          },
          position: "A8",
        },
        {
          piece: {
            value: "knight",
            type: "white",
          },
          position: "B8",
        },
        {
          piece: {
            value: "bishop",
            type: "white",
          },
          position: "C8",
        },
        {
          piece: {
            value: "queen",
            type: "white",
          },
          position: "D8",
        },
        {
          piece: {
            value: "king",
            type: "white",
          },
          position: "E8",
        },
        {
          piece: {
            value: "bishop",
            type: "white",
          },
          position: "F8",
        },
        {
          piece: {
            value: "knight",
            type: "white",
          },
          position: "G8",
        },
        {
          piece: {
            value: "rook",
            type: "white",
          },
          position: "H8",
        },
      ],
      [
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "A7",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "B7",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "C7",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "D7",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "E7",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "F7",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "G7",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "H7",
        },
      ],
      [
        {
          position: "A6",
        },
        {
          position: "B6",
        },
        {
          position: "C6",
        },
        {
          position: "D6",
        },
        {
          position: "E6",
        },
        {
          position: "F6",
        },
        {
          position: "G6",
        },
        {
          position: "H6",
        },
      ],
      [
        {
          position: "A5",
        },
        {
          position: "B5",
        },
        {
          position: "C5",
        },
        {
          position: "D5",
        },
        {
          position: "E5",
        },
        {
          position: "F5",
        },
        {
          position: "G5",
        },
        {
          position: "H5",
        },
      ],
      [
        {
          position: "A4",
        },
        {
          position: "B4",
        },
        {
          position: "C4",
        },
        {
          position: "D4",
        },
        {
          position: "E4",
        },
        {
          position: "F4",
        },
        {
          position: "G4",
        },
        {
          position: "H4",
        },
      ],
      [
        {
          position: "A3",
        },
        {
          position: "B3",
        },
        {
          position: "C3",
        },
        {
          position: "D3",
        },
        {
          position: "E3",
        },
        {
          position: "F3",
        },
        {
          position: "G3",
        },
        {
          position: "H3",
        },
      ],
      [
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "A2",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "B2",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "C2",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "D2",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "E2",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "F2",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "G2",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "H2",
        },
      ],
      [
        {
          piece: {
            value: "rook",
            type: "black",
          },
          position: "A1",
        },
        {
          piece: {
            value: "knight",
            type: "black",
          },
          position: "B1",
        },
        {
          piece: {
            value: "bishop",
            type: "black",
          },
          position: "C1",
        },
        {
          piece: {
            value: "queen",
            type: "black",
          },
          position: "D1",
        },
        {
          piece: {
            value: "king",
            type: "black",
          },
          position: "E1",
        },
        {
          piece: {
            value: "bishop",
            type: "black",
          },
          position: "F1",
        },
        {
          piece: {
            value: "knight",
            type: "black",
          },
          position: "G1",
        },
        {
          piece: {
            value: "rook",
            type: "black",
          },
          position: "H1",
        },
      ],
    ]);
  });

  it("Should create black->black board type", () => {
    expect(createBoard("black->white")).toEqual([
      [
        {
          piece: {
            value: "rook",
            type: "black",
          },
          position: "A8",
        },
        {
          piece: {
            value: "knight",
            type: "black",
          },
          position: "B8",
        },
        {
          piece: {
            value: "bishop",
            type: "black",
          },
          position: "C8",
        },
        {
          piece: {
            value: "queen",
            type: "black",
          },
          position: "D8",
        },
        {
          piece: {
            value: "king",
            type: "black",
          },
          position: "E8",
        },
        {
          piece: {
            value: "bishop",
            type: "black",
          },
          position: "F8",
        },
        {
          piece: {
            value: "knight",
            type: "black",
          },
          position: "G8",
        },
        {
          piece: {
            value: "rook",
            type: "black",
          },
          position: "H8",
        },
      ],
      [
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "A7",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "B7",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "C7",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "D7",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "E7",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "F7",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "G7",
        },
        {
          piece: {
            value: "pawn",
            type: "black",
          },
          position: "H7",
        },
      ],
      [
        {
          position: "A6",
        },
        {
          position: "B6",
        },
        {
          position: "C6",
        },
        {
          position: "D6",
        },
        {
          position: "E6",
        },
        {
          position: "F6",
        },
        {
          position: "G6",
        },
        {
          position: "H6",
        },
      ],
      [
        {
          position: "A5",
        },
        {
          position: "B5",
        },
        {
          position: "C5",
        },
        {
          position: "D5",
        },
        {
          position: "E5",
        },
        {
          position: "F5",
        },
        {
          position: "G5",
        },
        {
          position: "H5",
        },
      ],
      [
        {
          position: "A4",
        },
        {
          position: "B4",
        },
        {
          position: "C4",
        },
        {
          position: "D4",
        },
        {
          position: "E4",
        },
        {
          position: "F4",
        },
        {
          position: "G4",
        },
        {
          position: "H4",
        },
      ],
      [
        {
          position: "A3",
        },
        {
          position: "B3",
        },
        {
          position: "C3",
        },
        {
          position: "D3",
        },
        {
          position: "E3",
        },
        {
          position: "F3",
        },
        {
          position: "G3",
        },
        {
          position: "H3",
        },
      ],
      [
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "A2",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "B2",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "C2",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "D2",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "E2",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "F2",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "G2",
        },
        {
          piece: {
            value: "pawn",
            type: "white",
          },
          position: "H2",
        },
      ],
      [
        {
          piece: {
            value: "rook",
            type: "white",
          },
          position: "A1",
        },
        {
          piece: {
            value: "knight",
            type: "white",
          },
          position: "B1",
        },
        {
          piece: {
            value: "bishop",
            type: "white",
          },
          position: "C1",
        },
        {
          piece: {
            value: "queen",
            type: "white",
          },
          position: "D1",
        },
        {
          piece: {
            value: "king",
            type: "white",
          },
          position: "E1",
        },
        {
          piece: {
            value: "bishop",
            type: "white",
          },
          position: "F1",
        },
        {
          piece: {
            value: "knight",
            type: "white",
          },
          position: "G1",
        },
        {
          piece: {
            value: "rook",
            type: "white",
          },
          position: "H1",
        },
      ],
    ]);
  });
});
