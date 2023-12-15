import chessLogo from "/chess.png";
import { ChessGameContext } from "./state";
import { Piece } from "./components";
import { Modal } from "./components/modal";
import { BOARD_TYPES } from "./chess";
import { useState } from "react";

import "./App.css";

function App() {
  const chessGame = ChessGameContext.useActorRef();
  const board = ChessGameContext.useSelector((state) => state.context.board);

  return (
    <>
      <div>
        <img src={chessLogo} className="logo" alt="Vite logo" />
      </div>
      <h1 className="header">{"Chess TS"}</h1>

      <div className="chess-board">
        {board.map((column, ci) => {
          const size = 100 / board.length;

          return (
            <div
              key={ci}
              style={{ height: `${size}%` }}
              className="chess-board-column"
            >
              {column.map((box, bi) => {
                const colored = (ci + bi + 1) % 2 === 0;

                return (
                  <Piece
                    key={box.piece?.id + box.position}
                    box={box}
                    colored={colored}
                    size={size}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Setting */}
      {chessGame.getSnapshot().matches("start") && <Setting />}
    </>
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

export default App;
