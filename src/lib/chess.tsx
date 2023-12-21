import { useState } from "react";
import { ChessGameContext } from "@/state";
import { Piece } from "@/components";
import { Modal } from "@/components/modal";
import { BOARD_TYPES } from "@/chess";
import { motion } from "framer-motion";

// Images
import chessLogo from "../../public/chess.png";
import knightBlack from "@/assets/pieces/black/knight.svg";
import knightWhite from "@/assets/pieces/white/knight.svg";

function App() {
  const chessGame = ChessGameContext.useActorRef();
  const board = ChessGameContext.useSelector((state) => state.context.board);
  const pieceMove = ChessGameContext.useSelector(
    (state) => state.context.pieceMove
  );

  return (
    <>
      <div>
        <img src={chessLogo.src} className="logo" alt="Vite logo" />
      </div>

      <div className="header">
        <h1>{"Chess TS"}</h1>
        <PlayerHint />
      </div>

      <div className="chess-board">
        {board.map((column, ci) => {
          const size = 100 / board.length;

          return (
            <motion.div
              key={ci}
              style={{ height: `${size}%` }}
              className="chess-board-column"
            >
              {column.map((box, bi) => {
                const colored = (ci + bi + 1) % 2 === 0;

                return (
                  <Piece
                    key={box.piece?.id || box.position}
                    box={box}
                    colored={colored}
                    size={size}
                    // Move attr
                    moveSelection={pieceMove?.moves.includes(box.position)}
                    moveActive={box.piece?.id === pieceMove?.piece.id}
                    onMoveSelection={() => {
                      chessGame.send({
                        type: "chess.playing.setMove",
                        movePosition: box.position,
                      });
                    }}
                    // onClick
                    onClick={() => {
                      if (box.piece?.id === pieceMove?.piece.id) {
                        chessGame.send({
                          type: "chess.playing.setMove.reset",
                        });
                      } else {
                        box.piece &&
                          chessGame.send({
                            type: "chess.playing.getMoves",
                            piece: box.piece,
                            position: box.position,
                          });
                      }
                    }}
                  />
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* Setting */}
      {chessGame.getSnapshot().matches("start") && <Setting />}
    </>
  );
}

function PlayerHint() {
  const player = ChessGameContext.useSelector((state) => state.context.player);

  return (
    <div className="icon">
      {player === "white" ? (
        <img src={knightWhite.src} />
      ) : (
        <img src={knightBlack.src} />
      )}
    </div>
  );
}

function Setting() {
  const [type, setType] = useState(BOARD_TYPES[0]);
  const chessGame = ChessGameContext.useActorRef();

  return (
    <Modal>
      <div className="board-type-setting-select">
        <p>Board Type</p>
        <select
          className="select-input"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          {BOARD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() =>
          chessGame.send({ type: "chess.settings", boardType: type })
        }
        className="button button-setting"
      >
        Start Game
      </button>
    </Modal>
  );
}

export default function Chess() {
  return (
    <ChessGameContext.Provider>
      <App />
    </ChessGameContext.Provider>
  );
}
