import { Role } from "@/types";

export const DEFAULT_LOGIN_REDIRECT = "/auth/login";

export const roleRedirects: Record<Role, string> = {
  "ADMIN": "/admin/dashboard",
  "OWNER": "/client/dashboard",
  "MANAGER": "/client/dashboard",
  "SELLER": "/client/dashboard",
  "CASHIER": "/cashier",
};

export const getRouteByRole = (role: Role): string => {
  if (!role) return DEFAULT_LOGIN_REDIRECT;
  return roleRedirects[role] || DEFAULT_LOGIN_REDIRECT;
};
