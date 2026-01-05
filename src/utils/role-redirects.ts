import { Role } from "@/types";

export const DEFAULT_LOGIN_REDIRECT = "/auth/login";

export const roleRedirects: Record<Role, string> = {
  "ADMIN": "/admin/dashboard",
  "OWNER": "/client/dashboard",
  "MANAGER": "/client/dashboard",
  "CASHIER": "/pos/counter",
};

export const getRouteByRole = (role: Role): string => {
  if (!role) return DEFAULT_LOGIN_REDIRECT;
  return roleRedirects[role] || DEFAULT_LOGIN_REDIRECT;
};


/*

import { Role } from "@/types";

export const DEFAULT_LOGIN_REDIRECT = "/auth/login";

export const roleRedirects: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  OWNER: "/owner/dashboard",
  MANAGER: "/manager/dashboard",
  SELLER: "/seller/dashboard",
  CASHIER: "/cashier/dashboard",
};

export const getRouteByRole = (role: Role): string => {
  if (!role) return DEFAULT_LOGIN_REDIRECT;
  return roleRedirects[role] || DEFAULT_LOGIN_REDIRECT;
};

*/