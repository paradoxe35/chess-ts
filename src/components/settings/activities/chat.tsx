import { ChatBubble } from "@/components/ui/chat";
import { Input } from "@/components/ui/input";
import { ChessGameContext } from "@/state";
import { cn } from "@/utils/cn";
import { getPlayerLetter } from "@/utils/players";
import { useScrollToBottom } from "@/utils/scroll-to-bottom";
import { useState } from "react";

export function Chat() {
  let gameType = ChessGameContext.useSelector((c) => c.context.gameType);
  let players = ChessGameContext.useSelector((c) => c.context.players);

  let chats = ChessGameContext.useSelector((c) => c.context.chats || []);
  const { containerEl } = useScrollToBottom(chats.length);

  return (
    <>
      <div
        className={cn(
          "overflow-y-auto",
          gameType === "online" ? "max-h-[454px]" : "h-[480px]"
        )}
        ref={containerEl}
      >
        {chats.map((chat, i) => {
          const player = (players || {})[chat.player];
          return player ? (
            <ChatBubble key={i} chat={chat} player={player} />
          ) : (
            <></>
          );
        })}
      </div>

      {gameType === "online" && <SendMessage />}
    </>
  );
}

function SendMessage() {
  const [message, setMessage] = useState("");
  let gameChess = ChessGameContext.useActorRef();
  let activePlayer = ChessGameContext.useSelector(
    (c) => c.context.activePlayer
  );

  let players = ChessGameContext.useSelector((c) => c.context.players);

  const handleSendMessage = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key.toLowerCase() !== "enter" || !activePlayer || !players) {
      return;
    }

    const playerPosition = getPlayerLetter(activePlayer, players);

    if (playerPosition) {
      gameChess.send({
        type: "chess.playing.chat-message",
        chat: {
          message,
          player: playerPosition,
        },
      });

      setMessage("");
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write message"
        required
        min={3}
        minLength={3}
        className="w-2/3 mx-auto h-10"
        onKeyDown={handleSendMessage}
      />
    </div>
  );
}
