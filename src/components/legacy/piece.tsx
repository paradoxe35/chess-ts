import { useMemo } from "react";
import pieces from "../../assets/pieces";
import { BoardPosition } from "../../chess";
import { motion } from "framer-motion";
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
  const { box } = props;

  const svgPath = useMemo(() => {
    if (!box.piece) {
      return undefined;
    }
    const svg_icons = pieces[box.piece.type];
    const icon = svg_icons[box.piece.value];

    return icon.src as string;
  }, [box.piece]);

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
      {box.piece && (
        <motion.a
          key={box.piece.id}
          className={clsx("piece-box-icon", props.moveActive && "move-active")}
          title={box.piece?.value}
          onClick={props.onClick}
        >
          <img src={svgPath} />
        </motion.a>
      )}
    </div>
  );
}
