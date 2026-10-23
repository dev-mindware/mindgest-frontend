import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useConnectMindschool } from "@/hooks/plugins/use-connect-mindschool";
import { pluginsService } from "@/services/plugins-service";

jest.mock("@/services/plugins-service", () => ({
  pluginsService: {
    connect: jest.fn(),
    complete: jest.fn(),
    getStatus: jest.fn().mockResolvedValue([]),
  },
}));
jest.mock("@/services", () => ({
  pluginsService: jest.requireMock("@/services/plugins-service").pluginsService,
}));
jest.mock("@/utils/messages", () => ({
  SucessMessage: jest.fn(),
  ErrorMessage: jest.fn(),
  WarningMessage: jest.fn(),
  InfoMessage: jest.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe("useConnectMindschool", () => {
  afterEach(() => jest.restoreAllMocks());

  it("abre a janela de forma síncrona no clique, antes de pedir a URL", async () => {
    const order: string[] = [];
    jest.spyOn(window, "open").mockImplementation(() => {
      order.push("open");
      return null;
    });
    (pluginsService.connect as jest.Mock).mockImplementation(() => {
      order.push("connect");
      return Promise.resolve({ authorizeUrl: "x", state: "s" });
    });

    const { result } = renderHook(() => useConnectMindschool(), { wrapper });
    let promise!: Promise<unknown>;
    act(() => {
      promise = result.current.connect("store-1");
    });
    // a janela já foi pedida antes de qualquer await
    expect(order).toEqual(["open"]);
    await act(async () => {
      await promise;
    });
    // bloqueado: nunca se chega a pedir a URL
    expect(pluginsService.connect).not.toHaveBeenCalled();
    expect(result.current.phase).toBe("idle");
  });
});
