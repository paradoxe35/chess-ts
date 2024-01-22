import { cn } from "@/utils/cn";
import { Tab } from "@headlessui/react";
import {
  Activity,
  MessageText1,
  ArrowRotateLeft,
  Diamonds,
} from "iconsax-react";
import { Title } from "./new-settings";
import { History } from "./activities/history";
import { Chat } from "./activities/chat";
import { ChessGameContext } from "@/state";
import { Points } from "./activities/points";

const tabClassName =
  "rounded-lg p-[10px] ui-selected:bg-slate-50/15 outline-none";

export function ChessActivities() {
  const gameType = ChessGameContext.useSelector((c) => c.context.gameType);

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
            <MessageText1 />
          </Tab>

          <button title="Restart">
            <ArrowRotateLeft />
          </button>
        </Tab.List>
      </div>
    </Tab.Group>
  );
}
