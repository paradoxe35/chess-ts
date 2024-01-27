import { ChessGameContext, TChessMachine } from "@/state";
import { DataConnection, Peer } from "peerjs";
import { useCallback, useEffect, useRef } from "react";
import { uniqueId } from "@/utils/unique-id";
import { useCallbackRef, useSyncRef } from "@/utils/hooks";
import { PEER_HOST, PEER_PORT, PEER_SECURE } from "@/utils/constants";
import { Subscription } from "xstate";

const JOIN_REQUEST_TIMEOUT = 10 * 1000;
const RECONNECT_INTERVAL = 15 * 1000;
const MAX_CONNECT_ATTEMPT = 10;

type ExcludeContextKeys = keyof TChessMachine["context"];

const TURN_SERVERS = [
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
];

const EXCLUDE_CONTEXT_KEYS: ExcludeContextKeys[] = [
  "activePlayer",
  "pieceMove",
  "joinRequest",
];

export function useOnlinePlayer() {
  const canUpdateData = useRef<boolean>(true);
  const peer = useRef<Peer | null>(null);
  const reconnectAttempt = useRef(0);

  const actor = ChessGameContext.useActorRef();
  const actorRef = useSyncRef(actor);

  const [activePlayer, gameType, playId, players] =
    ChessGameContext.useSelector((c) => [
      c.context.activePlayer,
      c.context.gameType,
      c.context.playId,
      c.context.players,
    ]);

  const getContext = useCallback(() => {
    const context = { ...actorRef.current.getSnapshot().context };

    EXCLUDE_CONTEXT_KEYS.forEach((key) => delete context[key]);

    return context;
  }, [actorRef]);

  const getContextRef = useCallbackRef(getContext);

  const handleDataConnection = useCallback(
    (conn: DataConnection, playerType: "A" | "B") => {
      const subscription: { v?: Subscription } = {};
      // Player B connection object
      const onData = (data: unknown) => {
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
      };

      conn.on("data", onData);

      conn.once("open", () => {
        // Send initial Data on open connection [Player A]
        playerType === "A" && conn.send(getContextRef.current());

        // Subscribe on store and broadcast new changes
        subscription.v = actorRef.current.subscribe(() => {
          if (!canUpdateData.current) {
            return;
          }

          // When [Player B] and not yet connected then don't cancel
          const playerB = getContextRef.current().players?.B;
          if (playerType === "B" && !playerB) {
            return;
          }

          // Send changes
          conn.send(getContextRef.current());
        });
      });

      // Clean UP
      conn.once("iceStateChanged", (state) => {
        console.log("iceStateChanged from: state:", playerType, state);

        if (state === "disconnected") {
          conn.off("data", onData);
          subscription.v?.unsubscribe();
        }
      });

      return () => {
        conn.off("data", onData);
        subscription.v?.unsubscribe();
      };
    },
    []
  );

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
      host: PEER_HOST,
      port: PEER_PORT,
      secure: PEER_SECURE,
      config: {
        iceServers: TURN_SERVERS,
      },
    });

    peer.current.on("open", (id) => {
      console.log("[Player A] Peer ID is: " + id);
    });

    peer.current.on("connection", (conn) => {
      handleDataConnection(conn, "A");
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

    /**
     * Player B Peer
     */
    peer.current = new Peer(playerBId, {
      debug: 3,
      host: PEER_HOST,
      port: PEER_PORT,
      secure: PEER_SECURE,
      config: {
        iceServers: TURN_SERVERS,
      },
    });

    const connectionTimeout: { v?: NodeJS.Timeout } = {};
    const connectionInterval: { v?: NodeJS.Timeout } = {};
    const lastDataConnect: { v: () => void } = { v: () => void 0 };

    peer.current.on("open", (id) => {
      console.log("[Player B] Peer ID is: " + id);

      // Clean up before connection attempt
      const clean = () => {
        clearTimeout(connectionTimeout.v);
        clearInterval(connectionInterval.v);
        lastDataConnect.v();
      };

      clean();

      // Player A connection attempt
      let conn = peer.current!.connect(hashId);

      // Join request Connection timeout
      connectionTimeout.v = setTimeout(() => {
        conn.close();
        actorRef.current.send({
          type: "chess.online.join-request",
          request: {
            playerId: playerBId,
            request: "failed",
          },
        });

        connectionTimeout.v = undefined;
      }, JOIN_REQUEST_TIMEOUT);

      // When Connection is opened, send joint request
      conn.once("open", () => {
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
      });

      lastDataConnect.v = handleDataConnection(conn, "B");

      /**
       * Reconnect when conn
       */
      connectionInterval.v = setInterval(() => {
        const playerB = getContextRef.current().players?.B;

        // Attempt reconnection only if the [player b] has storage reference
        if (!playerB) {
          clearInterval(connectionInterval.v);
          return;
        }

        const failedStateConnection =
          !conn.peerConnection ||
          ["disconnected", "failed", "new"].includes(
            conn.peerConnection.connectionState
          );

        if (
          connectionTimeout.v === undefined &&
          failedStateConnection &&
          reconnectAttempt.current <= MAX_CONNECT_ATTEMPT
        ) {
          // Close last connection and clean data connection
          conn.close();
          lastDataConnect.v();

          // Reconnect attempt
          conn = peer.current!.connect(hashId);
          lastDataConnect.v = handleDataConnection(conn, "B");

          //  Reset reconnect attempt to 0 when a connection succeed
          conn.once("open", () => (reconnectAttempt.current = 0));

          // Increment reconnect attempt
          reconnectAttempt.current += 1;
        }
      }, RECONNECT_INTERVAL);

      // Clean Up if the actual peer disconnected
      peer.current?.once("disconnected", clean);
    });
  }, [players, playId, activePlayer, gameType, actorRef, getContextRef]);

  return {};
}
