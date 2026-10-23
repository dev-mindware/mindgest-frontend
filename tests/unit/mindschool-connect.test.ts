import {
  callbackChannelName,
  openBlankPopup,
  readCallbackMessage,
  runConnectFlow,
  type ConnectFlowDeps,
} from "@/lib/mindschool-connect";

// BroadcastChannel mínimo em memória (o jsdom não o traz)
class FakeChannel {
  static channels = new Map<string, Set<FakeChannel>>();
  onmessage: ((e: MessageEvent) => void) | null = null;
  constructor(public name: string) {
    const set = FakeChannel.channels.get(name) ?? new Set();
    set.add(this);
    FakeChannel.channels.set(name, set);
  }
  postMessage(data: unknown) {
    FakeChannel.channels.get(this.name)?.forEach((c) => {
      if (c !== this) c.onmessage?.({ data } as MessageEvent);
    });
  }
  close() {
    FakeChannel.channels.get(this.name)?.delete(this);
  }
}

function publish(state: string, data: unknown) {
  new FakeChannel(callbackChannelName(state)).postMessage(data);
}

function fakePopup() {
  return {
    closed: false,
    opener: {},
    location: { href: "about:blank" },
    close() {
      this.closed = true;
    },
  };
}

const STATE = "state-abc";

function makeDeps(overrides: Partial<ConnectFlowDeps> = {}): ConnectFlowDeps {
  return {
    requestAuthorization: jest
      .fn()
      .mockResolvedValue({ authorizeUrl: "https://school/authorize", state: STATE }),
    complete: jest.fn().mockResolvedValue({}),
    checkConnected: jest.fn().mockResolvedValue(false),
    pollIntervalMs: 20,
    timeoutMs: 400,
    ...overrides,
  };
}

const tick = (ms = 30) => new Promise((r) => setTimeout(r, ms));

beforeAll(() => {
  (globalThis as any).BroadcastChannel = FakeChannel;
});
beforeEach(() => FakeChannel.channels.clear());

describe("readCallbackMessage", () => {
  it("lê código e state do redirect", () => {
    expect(readCallbackMessage("?code=abc&state=xyz")).toEqual({ type: "mindschool-callback", state: "xyz", code: "abc" });
  });

  it("lê a recusa (error) com a descrição", () => {
    expect(readCallbackMessage("?error=access_denied&state=xyz&error_description=no")).toEqual({
      type: "mindschool-callback",
      state: "xyz",
      error: "access_denied",
      errorDescription: "no",
    });
  });

  it("devolve null sem state, ou sem code nem error (a barra de endereço já foi limpa)", () => {
    expect(readCallbackMessage("?code=abc")).toBeNull();
    expect(readCallbackMessage("?state=xyz")).toBeNull();
    expect(readCallbackMessage("")).toBeNull();
  });
});

describe("openBlankPopup", () => {
  afterEach(() => jest.restoreAllMocks());

  it("devolve null quando o bloqueador impede a janela", () => {
    jest.spyOn(window, "open").mockReturnValue(null);
    expect(openBlankPopup()).toBeNull();
  });

  it("corta o opener da janela aberta", () => {
    const popup = fakePopup();
    jest.spyOn(window, "open").mockReturnValue(popup as unknown as Window);
    expect(openBlankPopup()).toBe(popup);
    expect(popup.opener).toBeNull();
  });
});

describe("runConnectFlow", () => {
  it("sucesso: navega a janela, completa com code+state e fecha", async () => {
    const popup = fakePopup();
    const deps = makeDeps();
    const run = runConnectFlow(popup as unknown as Window, deps);
    await tick();
    expect(popup.location.href).toBe("https://school/authorize");
    publish(STATE, { type: "mindschool-callback", state: STATE, code: "c1" });
    await expect(run).resolves.toEqual({ status: "success" });
    expect(deps.complete).toHaveBeenCalledWith({ code: "c1", state: STATE });
    expect(popup.closed).toBe(true);
  });

  it("popup bloqueado: não pede autorização", async () => {
    const deps = makeDeps();
    await expect(runConnectFlow(null, deps)).resolves.toEqual({
      status: "blocked",
    });
    expect(deps.requestAuthorization).not.toHaveBeenCalled();
  });

  it("timeout: termina e fecha a janela", async () => {
    const popup = fakePopup();
    const deps = makeDeps({ timeoutMs: 80 });
    await expect(
      runConnectFlow(popup as unknown as Window, deps),
    ).resolves.toEqual({ status: "timeout" });
    expect(popup.closed).toBe(true);
  });

  it("state errado: mensagem ignorada, nunca completa", async () => {
    const popup = fakePopup();
    const deps = makeDeps({ timeoutMs: 120 });
    const run = runConnectFlow(popup as unknown as Window, deps);
    await tick();
    publish(STATE, { type: "mindschool-callback", state: "outro", code: "x" });
    await expect(run).resolves.toEqual({ status: "timeout" });
    expect(deps.complete).not.toHaveBeenCalled();
  });

  it("recusa na escola: devolve denied sem completar", async () => {
    const popup = fakePopup();
    const deps = makeDeps();
    const run = runConnectFlow(popup as unknown as Window, deps);
    await tick();
    publish(STATE, {
      type: "mindschool-callback",
      state: STATE,
      error: "access_denied",
    });
    await expect(run).resolves.toEqual({
      status: "denied",
      message: "access_denied",
    });
    expect(deps.complete).not.toHaveBeenCalled();
  });

  it("erro ao completar: devolve error", async () => {
    const popup = fakePopup();
    const boom = new Error("falhou");
    const deps = makeDeps({ complete: jest.fn().mockRejectedValue(boom) });
    const run = runConnectFlow(popup as unknown as Window, deps);
    await tick();
    publish(STATE, { type: "mindschool-callback", state: STATE, code: "c1" });
    await expect(run).resolves.toEqual({ status: "error", error: boom });
  });

  it("erro ao pedir a URL: fecha a janela em branco", async () => {
    const popup = fakePopup();
    const boom = new Error("403");
    const deps = makeDeps({
      requestAuthorization: jest.fn().mockRejectedValue(boom),
    });
    await expect(
      runConnectFlow(popup as unknown as Window, deps),
    ).resolves.toEqual({ status: "error", error: boom });
    expect(popup.closed).toBe(true);
  });

  it("polling: dá sucesso se a ligação aparecer sem mensagem", async () => {
    const popup = fakePopup();
    const deps = makeDeps({
      checkConnected: jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValue(true),
    });
    await expect(
      runConnectFlow(popup as unknown as Window, deps),
    ).resolves.toEqual({ status: "success" });
  });

  it("janela fechada pelo utilizador: cancelado", async () => {
    const popup = fakePopup();
    const deps = makeDeps({ timeoutMs: 5000 });
    const run = runConnectFlow(popup as unknown as Window, deps);
    await tick();
    popup.closed = true;
    await expect(run).resolves.toEqual({ status: "cancelled" });
  });

  it("cancelar via signal", async () => {
    const popup = fakePopup();
    const controller = new AbortController();
    const deps = makeDeps({ signal: controller.signal, timeoutMs: 5000 });
    const run = runConnectFlow(popup as unknown as Window, deps);
    await tick();
    controller.abort();
    await expect(run).resolves.toEqual({ status: "cancelled" });
  });
});
