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
  const playerType = ChessGameContext.useSelector((c) => c.context.playerType);

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

          {playerType === "online" && (
            <Tab.Panel>
              <Chat />
            </Tab.Panel>
          )}
        </Tab.Panels>

        {/* Menu */}
        <Tab.List className="flex space-x-5">
          <Tab className={tabClassName}>
            <Activity />
          </Tab>

          <Tab className={tabClassName}>
            <Diamonds />
          </Tab>

          <button>
            <ArrowRotateLeft />
          </button>

          {playerType === "online" && (
            <Tab className={tabClassName}>
              <MessageText1 />
            </Tab>
          )}
        </Tab.List>
      </div>
    </Tab.Group>
  );
}
