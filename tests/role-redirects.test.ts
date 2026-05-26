import { isValidRole, getRouteByRole } from "@/utils/role-redirects";

describe("isValidRole", () => {
  it("aceita roles válidas", () => {
    expect(isValidRole("ADMIN")).toBe(true);
    expect(isValidRole("OWNER")).toBe(true);
    expect(isValidRole("MANAGER")).toBe(true);
    expect(isValidRole("CASHIER")).toBe(true);
  });

  it("rejeita strings inválidas", () => {
    expect(isValidRole("SUPERHACKER")).toBe(false);
    expect(isValidRole("admin")).toBe(false); // case sensitive
    expect(isValidRole("")).toBe(false);
    expect(isValidRole("ROOT")).toBe(false);
  });

  it("rejeita tipos não-string", () => {
    expect(isValidRole(null)).toBe(false);
    expect(isValidRole(undefined)).toBe(false);
    expect(isValidRole(123)).toBe(false);
    expect(isValidRole({})).toBe(false);
    expect(isValidRole([])).toBe(false);
    expect(isValidRole(true)).toBe(false);
  });
});

describe("getRouteByRole", () => {
  it("retorna rota correta para cada role", () => {
    expect(getRouteByRole("ADMIN")).toBe("/admin/dashboard");
    expect(getRouteByRole("OWNER")).toBe("/dashboard");
    expect(getRouteByRole("MANAGER")).toBe("/dashboard");
    expect(getRouteByRole("CASHIER")).toBe("/pos/counter");
  });

  it("retorna /auth/login para role inválido", () => {
    expect(getRouteByRole("HACKER")).toBe("/auth/login");
    expect(getRouteByRole(undefined)).toBe("/auth/login");
    expect(getRouteByRole(null)).toBe("/auth/login");
    expect(getRouteByRole("")).toBe("/auth/login");
  });
});
