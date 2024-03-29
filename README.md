# Chess TS

<center>
    <img src="public/chess.png" alt="Chess TS screenshot" width="100">
</center>

Chess TS is a web-based chess application for playing chess online against another player or computer AI.

## Key Features

- Play chess online in real-time
- Supports two human players
- Single player mode against AI bot
- 3 difficulty levels for AI opponent
- AI suggests best next moves
- WebRTC powers real-time multiplayer
- Time controls and timeouts to keep games moving

## Coming Features

- Castling - Allow the king and rook to make a special joint move
- Chess timer - Track each player's time during the game
- Protect the king - Prevent kings from being captured
- Checkmate - A player wins if their opponent's king is under attack and has no legal move
- Voice chat - Enable audio communication for online multiplayer
- Game replay - Save and replay previous games from local storage

## Rules and Gameplay

- Standard chess rules and gameplay
- Board represents standard 8x8 chess board
- Legal moves are enforced by the app
- Check, checkmate, stalemate, and draw detection
- Pawn promotion when reaching last rank
- En passant captures
- Castling under standard rules

## AI Opponent Details

- Play against built-in chess AI in single player mode
- 3 selectable difficulty levels
  - Easy - Makes random legal moves
  - Normal - Looks 1-2 moves ahead
  - Hard - Employs aggressive strategies and can see 3+ moves ahead
- AI player evaluates positions and provides suggestions for optimal next moves

## Technical Details

- Built with TypeScript and React
- React Hooks for state management
- WebRTC used for real-time multiplayer (peer.js)
- SVG used for rendering chess board and pieces
- Fully responsive design supporting mobile, tablet and desktop

## Getting Started

The app is not yet deployed online. To run it locally:

1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Go to `http://localhost:3000`

## TURN/STUN

- https://freeturn.net
- https://freestun.net
- https://www.metered.ca
- https://github.com/coturn/coturn
- https://eturnal.net
