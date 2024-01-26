import { ChessGameContext, TChessMachine } from "@/state";
import { Peer } from "peerjs";
import { useCallback, useEffect, useRef } from "react";
import { uniqueId } from "./unique-id";
import { useCallbackRef, useSyncRef } from "./hooks";
import { PEER_HOST, PEER_PORT, PEER_SECURE } from "./constants";

const JOIN_REQUEST_TIMEOUT = 5 * 1000;
type ExcludeContextKeys = keyof TChessMachine["context"];

const EXCLUDE_CONTEXT_KEYS: ExcludeContextKeys[] = [
  "activePlayer",
  "pieceMove",
  "joinRequest",
];

export function useOnlinePlayer() {
  const canUpdateData = useRef<boolean>(true);
  const peer = useRef<Peer | null>(null);
  const actor = ChessGameContext.useActorRef();
  const actorRef = useSyncRef(actor);

  const activePlayer = ChessGameContext.useSelector(
    (c) => c.context.activePlayer
  );
  const gameType = ChessGameContext.useSelector((c) => c.context.gameType);
  const playId = ChessGameContext.useSelector((c) => c.context.playId);
  const players = ChessGameContext.useSelector((c) => c.context.players);

  const getContext = useCallback(() => {
    const context = { ...actorRef.current.getSnapshot().context };

    EXCLUDE_CONTEXT_KEYS.forEach((key) => delete context[key]);

    return context;
  }, [actorRef]);

  const getContextRef = useCallbackRef(getContext);

  /**
   *  Player A function
   */
  useEffect(() => {
    const playerA = players?.A;

    if (
      !playerA ||
      !playId ||
      gameType !== "online" ||
      playerA.id !== playId ||
      activePlayer?.id !== playerA.id
    ) {
      return;
    }

    if (peer.current !== null) {
      return;
    }

    /**
     * Player A Peer
     */
    peer.current = new Peer(playId, {
      debug: 3,
      config: {
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:standard.relay.metered.ca:80",
            username: "9b7749116be56538539f6796",
            credential: "mH20lJenKz+GjjZi",
          },
          {
            urls: "turn:standard.relay.metered.ca:80?transport=tcp",
            username: "9b7749116be56538539f6796",
            credential: "mH20lJenKz+GjjZi",
          },
          {
            urls: "turn:standard.relay.metered.ca:443",
            username: "9b7749116be56538539f6796",
            credential: "mH20lJenKz+GjjZi",
          },
          {
            urls: "turns:standard.relay.metered.ca:443?transport=tcp",
            username: "9b7749116be56538539f6796",
            credential: "mH20lJenKz+GjjZi",
          },
        ],
      },
    });

    peer.current.on("open", (id) => {
      console.log("[Player A] Peer ID is: " + id);
    });

    peer.current.on("connection", (conn) => {
      // Player B connection object
      conn.on("data", (data) => {
        // console.log("[Player A] Data: ", data);

        const dataContext = data as TChessMachine["context"];
        canUpdateData.current = false;

        // Update state here
        actorRef.current.send({
          type: "chess.online.merge-data",
          context: dataContext,
        });

        setTimeout(() => {
          canUpdateData.current = true;
        }, 100);
      });

      conn.on("open", () => {
        conn.send(getContextRef.current());

        const subscription = actorRef.current.subscribe(() => {
          if (!canUpdateData.current) {
            return;
          }

          conn.send(getContextRef.current());
        });

        conn.once("close", subscription.unsubscribe);
      });

      conn.on("iceStateChanged", (st) => {
        console.log("[Player B] iceStateChanged: ", st);
      });
    });
  }, [players, activePlayer, playId, gameType, actorRef, getContextRef]);

  /**
   * Player B function
   */
  useEffect(() => {
    const hashId = window.location.hash.replace("#/", "");

    if ((gameType && gameType !== "online") || hashId.trim().length < 2) {
      return;
    }

    const context = actorRef.current.getSnapshot().context;
    const playerB = context.players?.B;
    const playerBId = playerB?.id || uniqueId();

    if (activePlayer?.id === hashId || peer.current !== null) {
      return;
    }

    // Send join request idle
    actorRef.current.send({
      type: "chess.online.join-request",
      request: {
        playerId: playerBId,
        request: "idle",
      },
    });

    const connectionTimeout: { v?: NodeJS.Timeout } = {};

    /**
     * Player B Peer
     */
    peer.current = new Peer(playerBId, {
      debug: 3,
      config: {
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:standard.relay.metered.ca:80",
            username: "9b7749116be56538539f6796",
            credential: "mH20lJenKz+GjjZi",
          },
          {
            urls: "turn:standard.relay.metered.ca:80?transport=tcp",
            username: "9b7749116be56538539f6796",
            credential: "mH20lJenKz+GjjZi",
          },
          {
            urls: "turn:standard.relay.metered.ca:443",
            username: "9b7749116be56538539f6796",
            credential: "mH20lJenKz+GjjZi",
          },
          {
            urls: "turns:standard.relay.metered.ca:443?transport=tcp",
            username: "9b7749116be56538539f6796",
            credential: "mH20lJenKz+GjjZi",
          },
        ],
      },
    });

    peer.current.on("open", (id) => {
      console.log("[Player B] Peer ID is: " + id);

      // Player A connection object
      const conn = peer.current!.connect(hashId);

      // Join request Connection timeout
      connectionTimeout.v = setTimeout(() => {
        try {
          peer.current?.disconnect();
          conn.close();
          peer.current = null;
        } catch (_) {}

        actorRef.current.send({
          type: "chess.online.join-request",
          request: {
            playerId: playerBId,
            request: "failed",
          },
        });
      }, JOIN_REQUEST_TIMEOUT);

      // Receive messages
      conn.on("data", function (data) {
        // console.log("[Player B] Data: ", data);

        // Clear Join request connection timeout
        if (connectionTimeout.v) {
          clearTimeout(connectionTimeout.v);
          actorRef.current.send({
            type: "chess.online.join-request",
            request: {
              playerId: playerBId,
              request: "open",
            },
          });

          connectionTimeout.v = undefined;
        }

        const dataContext = data as TChessMachine["context"];
        canUpdateData.current = false;

        // Update state here
        actorRef.current.send({
          type: "chess.online.merge-data",
          context: dataContext,
        });

        setTimeout(() => {
          canUpdateData.current = true;
        }, 100);
      });

      conn.on("open", () => {
        const subscription = actorRef.current.subscribe(() => {
          const playerB = getContextRef.current().players?.B;

          if (!canUpdateData.current || !playerB) {
            return;
          }

          conn.send(getContextRef.current());
        });

        conn.once("close", subscription.unsubscribe);
      });

      conn.on("iceStateChanged", (st) => {
        console.log("[Player B] iceStateChanged: ", st);
      });
    });
  }, [players, playId, activePlayer, gameType, actorRef, getContextRef]);

  return {};
}
