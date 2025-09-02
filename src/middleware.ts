import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";
import {
  PUBLIC_ROUTES,
  PRIVATE_ROUTE_PREFIXES,
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
  UPGRADE_REDIRECT,
  ROUTE_FEATURE_MAPPING,
} from "@/constants/routes";
import { hasPlanAccess } from "@/lib/features";
import { Plan, Role } from "@/types";
import { cookies } from "next/headers";
import { SESSION_COOKIE_KEY } from "@/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookies = await cookies();

  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  const sessionCookie = authCookies.get(SESSION_COOKIE_KEY)?.value;
  const sessionPayload = sessionCookie ? await decrypt(sessionCookie) : null;
  const isAuthenticated = !!sessionPayload;

  const plan = (sessionPayload?.user?.company?.plan || null) as Plan;
  const role = (sessionPayload?.user?.role || null) as Role;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  if (isPublicRoute) {
    if (isAuthenticated && pathname === DEFAULT_LOGIN_REDIRECT) {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const isPrivateRoute = PRIVATE_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }
// aqui
  const routePermission = ROUTE_FEATURE_MAPPING.find((item) =>
    pathname.startsWith(item.pathPrefix)
  );

  if (!routePermission) {
    console.log(
      `[Middleware] Rota não encontrada no mapa de permissões: ${pathname}`
    );
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    routePermission.minPlan &&
    !hasPlanAccess(plan, routePermission.minPlan)
  ) {
    console.log(
      `[Middleware] Plano insuficiente (${plan} < ${routePermission.minPlan}) -> Upgrade`
    );
    return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
  }

  if (routePermission.roles && !routePermission.roles.includes(role)) {
    console.log(
      `[Middleware] Acesso negado por ROLE para a rota ${pathname}. Role: ${role}`
    );
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|json)|\\.well-known|unauthorized).*)",
  ],
};