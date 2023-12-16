import { useEffect, useState } from "react";
import pieces from "../assets/pieces";
import { BoardPosition } from "../chess";
import "./piece.css";
import clsx from "clsx";

type Props = {
  box: BoardPosition;
  size: number;
  colored: boolean;
  moveSelection?: boolean;
  moveActive?: boolean;
  onMoveSelection?: () => void;
  onClick?: () => void;
};

export function Piece(props: Props) {
  const [svgPath, setSvgPathSvg] = useState<string | undefined>();
  const { box } = props;

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
        width: `${props.size}%`,
      }}
      className={clsx(
        "chess-board-box",
        props.colored && "colored",
        props.moveSelection && "move-selection"
      )}
      onClick={props.moveSelection ? props.onMoveSelection : undefined}
    >
      {svgPath && (
        <a
          className={clsx("piece-box-icon", props.moveActive && "move-active")}
          title={box.piece?.value}
          onClick={props.onClick}
        >
          <img src={svgPath} />
        </a>
      )}
    </div>
  );
}
