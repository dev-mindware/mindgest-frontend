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

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  if (isPublicRoute) {
    if (isAuthenticated && pathname === DEFAULT_LOGIN_REDIRECT) {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const isPrivateRoute = PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  // A PARTIR DAQUI, O USUÁRIO ESTÁ AUTENTICADO E EM UMA ROTA PRIVADA
  
  // Encontre a permissão da rota na sua lista explícita
  const routePermission = ROUTE_FEATURE_MAPPING.find((item) => pathname.startsWith(item.pathPrefix));
  
  if (!routePermission) {
    // Se a rota não for encontrada, é uma rota desconhecida ou não mapeada
    console.log(`[Middleware] Rota não encontrada no mapa de permissões: ${pathname}`);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // 1. Verificação de Plano
  if (routePermission.minPlan && !hasPlanAccess(plan, routePermission.minPlan)) {
    console.log(`[Middleware] Plano insuficiente (${plan} < ${routePermission.minPlan}) -> Upgrade`);
    return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
  }

  // 2. Verificação de Feature (opcional, se a rota tiver uma feature específica)
  // O seu código original tinha essa verificação, então a mantive aqui,
  // mas o 'feature' é opcional.
  // userFeatures precisa ser definido em algum lugar, se for usado.
  // if (routePermission.feature && !userFeatures.includes(routePermission.feature)) {
  //   return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
  // }
  
  // 3. Verificação de Role (agora com a propriedade 'roles' no objeto)
  if (routePermission.roles && !routePermission.roles.includes(role)) {
      console.log(`[Middleware] Acesso negado por ROLE para a rota ${pathname}. Role: ${role}`);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|json)|\\.well-known|unauthorized).*)",
  ],
};







/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";
import {
  PUBLIC_ROUTES,
  PRIVATE_ROUTE_PREFIXES,
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
  UPGRADE_REDIRECT,
} from "@/constants/routes";
import { featuresByPlan, hasPlanAccess } from "@/lib/features";
import { sidebarPermissions } from "@/constants/permissions";
import { Plan, Role } from "./types";
import { cookies } from "next/headers";
import { SESSION_COOKIE_KEY } from "./constants";

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

  console.log(`\n[Middleware] Rota: ${pathname}`);
  console.log(`[Middleware] Autenticado: ${isAuthenticated}, Role: ${role}, Plano: ${plan}`);

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  if (isPublicRoute) {
    if (isAuthenticated) {
      if (pathname.startsWith(DEFAULT_LOGIN_REDIRECT)) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const isPrivateRoute = PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  const userFeatures = featuresByPlan[plan] || [];
  const allowedMenu = sidebarPermissions[role as keyof typeof sidebarPermissions] || [];
  const routePermission = allowedMenu.find((item) => pathname.startsWith(item.path));

  if (!routePermission) {
    console.log(`[Middleware] Rota não encontrada no menu permitido -> Bloqueando`);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (routePermission.minPlan && !hasPlanAccess(plan, routePermission.minPlan)) {
    console.log(`[Middleware] Plano insuficiente (${plan} < ${routePermission.minPlan}) -> Upgrade`);
    return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
  }

  if (routePermission.feature && !userFeatures.includes(routePermission.feature)) {
    console.log(`[Middleware] Feature "${routePermission.feature}" indisponível -> Upgrade`);
    return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|json)|\\.well-known).*)",
  ],
};






/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  PUBLIC_ROUTES,
  PRIVATE_ROUTE_PREFIXES,
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
  UPGRADE_REDIRECT,
} from "@/constants/routes";

import { PLAN_COOKIE_KEY, ROLE_COOKIE_KEY, TOKEN_COOKIE_KEY } from "@/constants";
import { featuresByPlan, hasPlanAccess } from "@/lib/features";
import { sidebarPermissions } from "@/constants/permissions";
import { Role, Plan } from "./types";

// Função auxiliar: checa se a rota está no menu permitido
function isPathAllowed(pathname: string, role: string, plan: Plan): boolean {
  const menu = sidebarPermissions[role as keyof typeof sidebarPermissions] || [];
  return menu.some(item => {
    if (!pathname.startsWith(item.path)) return false;
    if (item.minPlan && !hasPlanAccess(plan, item.minPlan)) return false;
    return true;
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value as string;
  const plan = request.cookies.get(PLAN_COOKIE_KEY)?.value as Plan;
  const role = request.cookies.get(ROLE_COOKIE_KEY)?.value as Role;

  const isAuthenticated = !!token && !!plan && !!role;

  console.log(`\n[Middleware] Rota acessada: ${pathname}`);
  console.log(`[Middleware] Role: ${role}, Plano: ${plan}`);

  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  // Rotas públicas liberadas
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verifica se rota é privada
  const isPrivateRoute = PRIVATE_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  // Se não autenticado → login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  // Features ativas pelo plano
  const userFeatures = featuresByPlan[plan] || [];

  // Checa se a rota está dentro do menu permitido para o role + plan + features
  const allowedMenu = sidebarPermissions[role as keyof typeof sidebarPermissions] || [];
  const routePermission = allowedMenu.find(item => pathname.startsWith(item.path));

  if (!routePermission) {
    console.log(`[Middleware] Rota não encontrada no menu permitido → Bloqueando`);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Checa plano mínimo
  if (routePermission.minPlan && !hasPlanAccess(plan, routePermission.minPlan)) {
    console.log(`[Middleware] Plano insuficiente (${plan} < ${routePermission.minPlan}) → Upgrade`);
    return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
  }

  // Checa feature necessária
  if (routePermission.feature && !userFeatures.includes(routePermission.feature)) {
    console.log(`[Middleware] Feature "${routePermission.feature}" indisponível → Upgrade`);
    return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
  }

  // Se passou por todas as regras → libera
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|json)|\\.well-known).*)",
  ],
};



/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PUBLIC_ROUTES,
  PRIVATE_ROUTE_PREFIXES,
  ROUTE_FEATURE_MAPPING,
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
  UPGRADE_REDIRECT,
} from "@/constants/routes";
import { Plan, featuresByPlan, hasPlanAccess } from "@/lib/features";
import { PLAN_COOKIE_KEY, TOKEN_COOKIE_KEY } from "./constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;
  const plan = request.cookies.get(PLAN_COOKIE_KEY)?.value as Plan; // problemas na hora de actualizar no backend, anão ser q eu faça uma req pra poder dar um update no plan
  const isAuthenticated = !!token && !!plan;

  console.log(`\n[Middleware] Rota acessada: ${pathname}`);
  console.log(`[Middleware] Plano atual: ${plan}`);

  if (pathname.startsWith(API_AUTH_PREFIX)) {
    console.log("[Middleware] Rota de API auth - Acesso permitido");
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    console.log("[Middleware] Rota pública - Acesso permitido");
    return NextResponse.next();
  }

  const isPrivateRoute = PRIVATE_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isPrivateRoute) {
    console.log("[Middleware] Rota não protegida - Acesso permitido");
    return NextResponse.next();
  }

  console.log("[Middleware] Rota protegida detectada");

  if (!isAuthenticated) {
    console.log(
      "[Middleware] Usuário não autenticado - Redirecionando para login"
    );
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  const routeRequirement = ROUTE_FEATURE_MAPPING.find((item) =>
    pathname.startsWith(item.pathPrefix)
  );

  if (routeRequirement) {
    console.log(`[Middleware] Requisitos da rota: 
      Feature: ${routeRequirement.feature}
      Plano mínimo: ${routeRequirement.minPlan}`);

    if (!hasPlanAccess(plan, routeRequirement.minPlan as Plan)) {
      console.log(
        `[Middleware] Plano insuficiente (${plan} < ${routeRequirement.minPlan}) - Redirecionando para upgrade`
      );
      return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
    }

    const userFeatures = featuresByPlan[plan] || [];
    const hasFeatureAccess = userFeatures.includes(routeRequirement.feature);

    if (!hasFeatureAccess) {
      console.log(
        `[Middleware] Feature não disponível no plano - Redirecionando para upgrade`
      );
      return NextResponse.redirect(new URL(UPGRADE_REDIRECT, request.url));
    }
  }

  console.log("[Middleware] Acesso permitido");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
 */  