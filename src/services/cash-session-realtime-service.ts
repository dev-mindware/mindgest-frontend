import { getAccessToken } from "@/actions/token";
import type { CashSession } from "@/types/cash-session";
import { io, type Socket } from "socket.io-client";

export type CashSessionRealtimePayload =
  | CashSession
  | {
      storeId?: string;
      session?: CashSession | null;
    }
  | null;

type CashSessionSubscriber = (payload?: CashSessionRealtimePayload) => void;

const subscribers = new Set<CashSessionSubscriber>();
let socket: Socket | null = null;
let connectionPromise: Promise<void> | null = null;

function getSocketEventName() {
  return (
    process.env.NEXT_PUBLIC_CASH_SESSION_SOCKET_EVENT ||
    "cash-session:updated"
  );
}

function notifySubscribers(payload?: CashSessionRealtimePayload) {
  subscribers.forEach((subscriber) => subscriber(payload));
}

async function connect() {
  if (socket || connectionPromise) return connectionPromise;

  const socketUrl =
    process.env.NEXT_PUBLIC_CASH_SESSION_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL;
  if (!socketUrl) return;

  connectionPromise = getAccessToken()
    .catch(() => null)
    .then((accessToken) => {
      if (subscribers.size === 0) return;

      socket = io(socketUrl, {
        transports: ["websocket"],
        withCredentials: true,
        auth: accessToken ? { token: accessToken } : undefined,
      });

      socket.on("connect", () => notifySubscribers());
      socket.on(getSocketEventName(), notifySubscribers);
    })
    .finally(() => {
      connectionPromise = null;
    });

  return connectionPromise;
}

function disconnectWhenUnused() {
  if (subscribers.size > 0 || !socket) return;

  socket.off("connect");
  socket.off(getSocketEventName(), notifySubscribers);
  socket.disconnect();
  socket = null;
}

export const cashSessionRealtimeService = {
  subscribe(subscriber: CashSessionSubscriber) {
    subscribers.add(subscriber);
    void connect();

    return () => {
      subscribers.delete(subscriber);
      disconnectWhenUnused();
    };
  },
};
