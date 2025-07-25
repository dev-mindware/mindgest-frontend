/**
 * @type {string[]}
 */
export const PUBLIC_ROUTES: string[] = [
  "/",
  "/login*",
  "/forgot-password*",
  "/register*",
];

/**
 * @type {string[]}
 */
export const PRIVATE_ROUTES: string[] = [
  "/admin:*",
  "/user:*",
];

/**
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/auth/login";