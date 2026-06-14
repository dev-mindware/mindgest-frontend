type SocketHandler = (...args: unknown[]) => void;

type MockSocket = {
  on: jest.Mock<MockSocket, [string, SocketHandler]>;
  off: jest.Mock<MockSocket, [string]>;
  disconnect: jest.Mock<void, []>;
};

const socketHandlers = new Map<string, SocketHandler>();
let mockSocket: MockSocket;

mockSocket = {
  on: jest.fn((event: string, handler: SocketHandler): MockSocket => {
    socketHandlers.set(event, handler);
    return mockSocket;
  }),
  off: jest.fn((event: string): MockSocket => {
    socketHandlers.delete(event);
    return mockSocket;
  }),
  disconnect: jest.fn(),
};
const mockIo = jest.fn(
  (_url: string, _options?: unknown): MockSocket => mockSocket,
);

jest.mock("socket.io-client", () => ({
  io: (url: string, options?: unknown) => mockIo(url, options),
}));

jest.mock("@/actions/token", () => ({
  getAccessToken: jest.fn().mockResolvedValue("access-token"),
}));

describe("cashSessionRealtimeService", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CASH_SESSION_SOCKET_URL = "https://socket.example.com";
    process.env.NEXT_PUBLIC_CASH_SESSION_SOCKET_EVENT = "cash-session:updated";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CASH_SESSION_SOCKET_URL;
    delete process.env.NEXT_PUBLIC_CASH_SESSION_SOCKET_EVENT;
  });

  it("partilha uma ligação e encerra-a apenas após a última subscrição", async () => {
    const { cashSessionRealtimeService } = await import(
      "@/services/cash-session-realtime-service"
    );
    const firstSubscriber = jest.fn();
    const secondSubscriber = jest.fn();

    const unsubscribeFirst = cashSessionRealtimeService.subscribe(firstSubscriber);
    const unsubscribeSecond = cashSessionRealtimeService.subscribe(secondSubscriber);
    await Promise.resolve();
    await Promise.resolve();

    expect(mockIo).toHaveBeenCalledTimes(1);
    expect(mockIo).toHaveBeenCalledWith(
      "https://socket.example.com",
      expect.objectContaining({
        transports: ["websocket"],
        auth: { token: "access-token" },
      }),
    );

    socketHandlers.get("cash-session:updated")?.({ storeId: "store-id" });
    expect(firstSubscriber).toHaveBeenCalledWith({ storeId: "store-id" });
    expect(secondSubscriber).toHaveBeenCalledWith({ storeId: "store-id" });

    unsubscribeFirst();
    expect(mockSocket.disconnect).not.toHaveBeenCalled();

    unsubscribeSecond();
    expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
  });
});
