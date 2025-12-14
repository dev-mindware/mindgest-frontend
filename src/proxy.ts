import { NextRequest, NextResponse } from "next/server";
import {
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
  PRIVATE_ROUTE_PREFIXES,
  PUBLIC_ROUTES,
  SESSION_COOKIE_KEY,
} from "./constants";

// Verifica se a rota é pública
function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname === "/" && PUBLIC_ROUTES.includes("/")) return true;

  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return false;
    if (!pathname.startsWith(route)) return false;

    const nextChar = pathname[route.length];
    return nextChar === undefined || nextChar === "/" || nextChar === "?";
  });
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignora chamadas da API de auth
  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE_KEY)?.value;
  const isAuthenticated = Boolean(sessionCookie);

  const isPublic = isPublicRoute(pathname);
  const isPrivate = PRIVATE_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Usuário já logado tentando acessar sign-in/sign-up → manda para landing
  if (isPublic && !isPrivate) {
   /*  const isAuthPage = ["/sign-in", "/sign-up"].includes(pathname);
    if (isAuthenticated && isAuthPage) {
      return NextResponse.redirect(new URL("/landing", req.url));
    } */
    return NextResponse.next();
  }

  // Rota privada sem autenticação → redireciona para login
  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  // Rota não pública e não privada → precisa estar autenticado
  if (!isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|json)|\\.well-known|unauthorized).*)",
  ],
};