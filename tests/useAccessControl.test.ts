import { renderHook } from "@testing-library/react";

// ============================================================================
// MOCKS — Mockamos os módulos antes do import do hook
// para evitar cadeia gigante de imports (nuqs, components, etc.)
// ============================================================================

jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/dashboard"),
}));

jest.mock("@/hooks/auth", () => ({
  useAuth: jest.fn(),
}));

// Mocka o constants/menu-items para evitar imports de componentes
jest.mock("@/constants/menu-items", () => ({
  menuItems: {
    items: [
      { url: "/dashboard", minPlan: undefined },
      { url: "/dashboard/analytics", minPlan: "Pro" },
      { url: "/admin", minPlan: undefined },
    ],
  },
}));

jest.mock("@/utils/role-redirects", () => ({
  getRouteByRole: (role: string) => {
    const map: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      OWNER: "/dashboard",
      MANAGER: "/dashboard",
      CASHIER: "/pos/counter",
    };
    return map[role] || "/auth/login";
  },
}));

// ============================================================================
// IMPORTAÇÕES APÓS MOCKS
// ============================================================================
import { useAuth } from "@/hooks/auth";
import { usePathname } from "next/navigation";
import { useAccessControl } from "@/providers";

const mockedUseAuth = useAuth as jest.Mock;
const mockedUsePathname = usePathname as jest.Mock;

// ============================================================================
// TESTES
// ============================================================================
describe("useAccessControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUsePathname.mockReturnValue("/dashboard");
  });

  it("retorna 'loading' enquanto autentica", () => {
    mockedUseAuth.mockReturnValue({ user: null, isAuthenticating: true });

    const { result } = renderHook(() => useAccessControl(["OWNER"]));
    expect(result.current.status).toBe("loading");
  });

  it("retorna 'unauthenticated' sem user", () => {
    mockedUseAuth.mockReturnValue({ user: null, isAuthenticating: false });

    const { result } = renderHook(() => useAccessControl(["OWNER"]));
    expect(result.current.status).toBe("unauthenticated");
  });

  it("retorna 'unauthorized' quando role não está na lista permitida", () => {
    mockedUseAuth.mockReturnValue({
      user: {
        role: "CASHIER",
        company: { subscription: { plan: { name: "Pro" } } },
      },
      isAuthenticating: false,
    });

    const { result } = renderHook(() => useAccessControl(["OWNER", "ADMIN"]));
    expect(result.current.status).toBe("unauthorized");
  });

  it("retorna 'allowed' quando tudo está OK", () => {
    mockedUseAuth.mockReturnValue({
      user: {
        role: "OWNER",
        company: { subscription: { plan: { name: "Pro" } } },
      },
      isAuthenticating: false,
    });

    const { result } = renderHook(() => useAccessControl(["OWNER"]));
    expect(result.current.status).toBe("allowed");
  });

  it("retorna 'plan_insufficient' quando plano é menor que requerido", () => {
    mockedUsePathname.mockReturnValue("/dashboard/analytics");
    mockedUseAuth.mockReturnValue({
      user: {
        role: "OWNER",
        company: { subscription: { plan: { name: "Base" } } },
      },
      isAuthenticating: false,
    });

    const { result } = renderHook(() => useAccessControl(["OWNER"]));
    expect(result.current.status).toBe("plan_insufficient");
  });

  it("CASHIER faz bypass do check de plano", () => {
    mockedUsePathname.mockReturnValue("/dashboard/analytics");
    mockedUseAuth.mockReturnValue({
      user: {
        role: "CASHIER",
        company: { subscription: { plan: { name: "Base" } } },
      },
      isAuthenticating: false,
    });

    const { result } = renderHook(() => useAccessControl(["CASHIER"]));
    expect(result.current.status).toBe("allowed");
  });
});