import { RouteProtector } from "@/contexts";
import { useAccessControl } from "@/providers";
import { render, screen } from "@testing-library/react";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/dashboard",
}));

jest.mock("@/providers/use-access-control", () => ({
  useAccessControl: jest.fn(),
}));

jest.mock("@/contexts/loader", () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

const mockedUseAccessControl = useAccessControl as jest.Mock;

describe("RouteProtector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra loader enquanto carrega", () => {
    mockedUseAccessControl.mockReturnValue({ status: "loading" });

    render(
      <RouteProtector allowed={["OWNER"]}>
        <div>Conteúdo protegido</div>
      </RouteProtector>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo protegido")).not.toBeInTheDocument();
  });

  it("renderiza children quando acesso permitido", () => {
    mockedUseAccessControl.mockReturnValue({ status: "allowed" });

    render(
      <RouteProtector allowed={["OWNER"]}>
        <div>Conteúdo protegido</div>
      </RouteProtector>
    );

    expect(screen.getByText("Conteúdo protegido")).toBeInTheDocument();
  });

  it("redireciona para /auth/login quando não autenticado", () => {
    mockedUseAccessControl.mockReturnValue({ status: "unauthenticated" });

    render(
      <RouteProtector allowed={["OWNER"]}>
        <div>Conteúdo</div>
      </RouteProtector>
    );

    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
    expect(screen.queryByText("Conteúdo")).not.toBeInTheDocument();
  });

  it("redireciona para /unauthorized sem permissão", () => {
    mockedUseAccessControl.mockReturnValue({ status: "unauthorized" });

    render(
      <RouteProtector allowed={["ADMIN"]}>
        <div>Admin only</div>
      </RouteProtector>
    );

    expect(mockReplace).toHaveBeenCalledWith("/unauthorized");
  });

  it("redireciona quando plano insuficiente", () => {
    mockedUseAccessControl.mockReturnValue({
      status: "plan_insufficient",
      redirectTo: "/some-other-route",
    });

    render(
      <RouteProtector allowed={["OWNER"]}>
        <div>Feature Pro</div>
      </RouteProtector>
    );

    expect(mockReplace).toHaveBeenCalledWith("/some-other-route");
  });

  it("usa fallback customizado se fornecido", () => {
    mockedUseAccessControl.mockReturnValue({ status: "loading" });

    render(
      <RouteProtector
        allowed={["OWNER"]}
        fallback={<div data-testid="custom-fallback">Custom</div>}
      >
        <div>Conteúdo</div>
      </RouteProtector>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });
});
