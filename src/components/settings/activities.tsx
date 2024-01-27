import { cn } from "@/utils/cn";
import { Popover, Tab } from "@headlessui/react";
import {
  Activity,
  MessageText1,
  ArrowRotateLeft,
  Diamonds,
} from "iconsax-react";
import { Title } from "./new-settings";
import { History } from "./activities/history";
import { Chat } from "./activities/chat";
import { ChessGameContext, TChat } from "@/state";
import { Points } from "./activities/points";
import { PropsWithChildren, useEffect, useState } from "react";
import { getPlayerLetter } from "@/utils/players";
import { Indicator } from "../ui/indicator";

const tabClassName =
  "rounded-lg p-[10px] ui-selected:bg-slate-50/15 outline-none";

export function ChessActivities() {
  return (
    <Tab.Group>
      <div
        className={cn(
          "flex flex-col gap-2",
          "justify-between mx-3 md:ml-auto md:w-4/5 h-full items-center"
        )}
      >
        <Title className="mt-0" />

        {/* Content */}
        <Tab.Panels className="flex-1 w-full">
          <Tab.Panel>
            <History />
          </Tab.Panel>

          <Tab.Panel>
            <Points />
          </Tab.Panel>

          <Tab.Panel className="h-full max-h-full relative">
            <Chat />
          </Tab.Panel>
        </Tab.Panels>

        {/* Menu */}
        <Tab.List className="flex space-x-5">
          <Tab className={tabClassName} title="Activities">
            <Activity />
          </Tab>

          <Tab className={tabClassName} title="Points">
            <Diamonds />
          </Tab>

          <Tab className={tabClassName} title="Chat">
            {({ selected }) => (
              <ChatNotifications selected={selected}>
                <MessageText1 />
              </ChatNotifications>
            )}
          </Tab>

          <RestartGame />
        </Tab.List>
      </div>
    </Tab.Group>
  );
}

function ChatNotifications(props: PropsWithChildren<{ selected: boolean }>) {
  const [notification, setNotification] = useState(false);

  const [activePlayer, gameType, players, chats] = ChessGameContext.useSelector(
    (c) => [
      c.context.activePlayer,
      c.context.gameType,
      c.context.players,
      c.context.chats,
    ]
  );

  const playerLetter =
    activePlayer && players && getPlayerLetter(activePlayer, players);

  useEffect(() => {
    if (props.selected || !playerLetter || gameType !== "online") {
      return;
    }

    const lastChat = chats[chats.length - 1] as TChat | undefined;
    if (lastChat?.player && lastChat?.player !== playerLetter) {
      setNotification(true);
    }
  }, [props.selected, chats.length, playerLetter, gameType]);

  return (
    <div
      className="w-full h-full relative"
      onClick={() => setNotification(false)}
    >
      {notification && <Indicator />}

      {props.children}
    </div>
  );
}

function RestartGame() {
  const actor = ChessGameContext.useActorRef();

  const restartGame = () => {
    actor.send({ type: "chess.reset" });
    history.replaceState(null, "", "/");

    location.reload();
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            title="Restart"
            className={cn("outline-none w-full h-full", open && "opacity-0")}
          >
            <ArrowRotateLeft />
          </Popover.Button>

          <Popover.Panel className="absolute z-10">
            <div role="tooltip" className="absolute z-10 inline-block -top-12">
              <button
                className="font-semibold bg-slate-50/10 p-2 rounded-md text-sm"
                onClick={restartGame}
              >
                New Game
              </button>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
