import { useEffect, useState } from "react";
import pieces from "../assets/pieces";
import { BoardPosition } from "../chess";
import "./piece.css";

type Props = {
  box: BoardPosition;
  size: number;
  colored: boolean;
  onClick?: () => void;
};

export function Piece({ box, size, colored, onClick }: Props) {
  const [svgPath, setSvgPathSvg] = useState<string | undefined>();

  useEffect(() => {
    if (!box.piece) {
      return;
    }

    const svg_icons = pieces[box.piece.type];
    const icon = svg_icons[pieces.resolve(box.piece.type, box.piece.value)];

    if (icon) {
      icon().then((v: any) => {
        setSvgPathSvg(v.default);
      });
    }
  }, []);

  return (
    <div
      data-position={box.position}
      style={{
        width: `${size}%`,
      }}
      className={`chess-board-box ${colored ? "colored" : ""}`}
    >
      {svgPath && (
        <a className="piece-box-icon">
          <img src={svgPath} />
        </a>
      )}
    </div>
  );
}
