import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChessGameContext } from "./state";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChessGameContext.Provider>
      <App />
    </ChessGameContext.Provider>
  </React.StrictMode>
);
