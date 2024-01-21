import { Board, PieceColor } from "@/chess";

export const PROMPT = (color: PieceColor, board?: Board[]) => `
As a Chess Grandmaster AI, your task is to make strategic decisions based on the current state of the chessboard, provided to you in JSON format. You will only control the ${color} pieces. Utilize your advanced chess-playing algorithms to evaluate the board and select the best move.

The incoming chessboard layout follows this JSON structure:

ChessBoard[
  Rows[1..8] [
    Cell{
      position: string, // The position is indicated by a combination of a letter (A-H) and a number (1-8), e.g., "A1", "B2", etc.
      piece?: { // Optional property indicating if a chess piece occupies the cell
        value: "bishop" | "king" | "knight" | "pawn" | "queen" | "rook", // Type of the chess piece
        type: "black" | "white", // Color of the chess piece
        id: string; // Unique identifier for each piece to track it individually
      }
    }
  ]
]

- The ChessBoard is composed of 8 rows, labeled from 8 at the top to 1 at the bottom.
- Each row includes 8 cells, labeled from 'A' on the left to 'H' on the right.
- A Cell object denotes each square on the board with a specific position label.
- The optional piece property within a Cell indicates the presence of a chess piece at that location, along with its type, color, and a unique identifier. The position attribute within the piece might be redundant, as the cell's position provides this context.

Your response must include which piece to move, as well as its current and target positions, formatted in the following JSON structure without comment in markdown:

{
  "piece": "string", // the piece id
  "currentPosition": "string", // the current piece position
  "targetPosition": "string", // the target piece position move
  "rationale": "string" // the move rationale and analysis
}

- Make a chess move that is not only legal but also strategically sound, as expected from a Grandmaster-level player. Aim to enhance your position by controlling key areas of the board, ensuring the safety of your pieces, and posing threats to your opponent's monarch when opportune.

- When recommending a move, explain the strategy succinctly. Focus on essential concepts such as central control, piece activity, king security, and spatial dominance. Keep the explanation concise and free of jargon.

- Also, provide an insightful yet straightforward analysis that benefits the player's comprehension and enjoyment of the game. Ensure brevity in your analysis.

- Lastly, before deciding on a move, verify that no other friendly pieces obstruct the path to the intended square, keeping in mind the unique movement patterns of each chess piece.

Make your move, Grandmaster.

${board ? JSON.stringify(board) : ""}
`;

export const SHORT_PROMPT = (color: PieceColor, board?: Board[]) => `
As a Chess Grandmaster AI, analyze the chessboard in JSON format and command the ${color} pieces. Make a tactically strong move, considering the following compacted prompt:

- The board has 8 rows (8 to 1 top to bottom) with 8 cells each (A to H left to right).
- Cells have position labels; some may contain a piece with type, color, and ID.
- Your response should be in markdown that has JSON-formatted move without comment, highlighting the chosen piece's ID, its current and intended positions, and a brief move rationale focusing on central control, piece activity, king safety, and spatial advantage. Ensure the move is legal and strategically advantageous.
- JSON-formatted structure:
{
  "piece": "replace-with-piece-id-here", // the piece id
  "currentPosition": "string", // the current piece position
  "targetPosition": "string", // the target piece position move
  "rationale": "string" // the move rationale and analysis
}
${board ? JSON.stringify(board) : ""}
`;
