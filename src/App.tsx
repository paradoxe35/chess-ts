import chessLogo from "/chess.png";
import { ChessGameContext } from "./state";
import "./App.css";

function App() {
  const chessGame = ChessGameContext.useActorRef();
  const { board } = chessGame.getSnapshot().context;

  return (
    <>
      <div>
        <img src={chessLogo} className="logo" alt="Vite logo" />
      </div>
      <h1 className="header">{"Chess TS"}</h1>

      <div className="chess-board">
        {board.map((column, ci) => {
          const size = `${100 / board.length}%`;

          return (
            <div
              key={ci}
              style={{ height: size }}
              className="chess-board-column"
            >
              {column.map((box, bi) => {
                const colored = (ci + bi + 1) % 2 === 0;

                return (
                  <div
                    key={box.position}
                    style={{
                      width: size,
                    }}
                    className={`chess-board-box ${colored ? "colored" : ""}`}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
