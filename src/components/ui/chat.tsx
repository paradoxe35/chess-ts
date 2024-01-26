import { TChat, PlayerDetail } from "@/state";
import { cn } from "@/utils/cn";

type Props = {
  chat: TChat;
  player: PlayerDetail;
};

export function ChatBubble(props: Props) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 mb-3",
        props.chat.player === "A" && "flex-row-reverse"
      )}
    >
      <img
        className="w-8 h-8 rounded-full"
        src={props.player.image}
        alt={props.player.name}
      />

      <div
        className={cn(
          "flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-gray-200 bg-slate-50/10",
          props.chat.player === "A"
            ? "rounded-s-xl rounded-b-xl rounded-es-xl"
            : "rounded-e-xl rounded-es-xl"
        )}
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-white/70 capitalize">
            {props.player.name}
          </span>
        </div>
        <p className="text-sm font-normal py-2 text-white/70">
          {props.chat.message}
        </p>
      </div>
    </div>
  );
}
