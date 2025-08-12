import { NextResponse } from "next/server";
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

/* // middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  PUBLIC_ROUTES,
  PRIVATE_ROUTE_PREFIXES,
  ROUTE_FEATURE_MAPPING,
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT
} from '@/constants/routes';
import { Plan, featuresByPlan } from '@/lib/features';
import { PLAN_COOKIE_KEY, TOKEN_COOKIE_KEY } from './constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;
  const plan = request.cookies.get(PLAN_COOKIE_KEY)?.value as Plan;
  const isAuthenticated = !!token && !!plan;

  console.log(`\n[Middleware] Rota acessada: ${pathname}`);
  console.log(`[Middleware] Autenticado: ${isAuthenticated}`);
  console.log(`[Middleware] Plano do usuário: ${plan}`);

  if (pathname.startsWith(API_AUTH_PREFIX)) {
    console.log(`[Middleware] Rota de API auth liberada: ${pathname}`);
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  if (isPublicRoute) {
    console.log(`[Middleware] Rota pública liberada: ${pathname}`);
    return NextResponse.next();
  }

  const isPrivateRoute = PRIVATE_ROUTE_PREFIXES.some(prefix => 
    pathname.startsWith(prefix)
  );

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  console.log(`[Middleware] Rota protegida detectada: ${pathname}`);

  if (!isAuthenticated) {
    const redirectUrl = new URL(DEFAULT_LOGIN_REDIRECT, request.url);
    console.log(`[Middleware] Acesso negado - Não autenticado. Redirecionando para: ${redirectUrl}`);
    return NextResponse.redirect(redirectUrl);
  }

  const routeRequirement = ROUTE_FEATURE_MAPPING.find(item => 
    pathname.startsWith(item.pathPrefix)
  );

  if (routeRequirement) {
    console.log(`[Middleware] Verificando requisitos para: ${routeRequirement.pathPrefix}`);
    console.log(`[Middleware] Feature necessária: ${routeRequirement.feature}`);
    console.log(`[Middleware] Plano mínimo: ${routeRequirement.minPlan}`);

    const userFeatures = featuresByPlan[plan] || [];
    const hasAccess = userFeatures.includes(routeRequirement.feature);

    console.log(`[Middleware] Features do usuário: ${userFeatures.join(', ')}`);
    console.log(`[Middleware] Acesso permitido: ${hasAccess}`);

    if (!hasAccess) {
      const upgradeUrl = new URL('/upgrade-plan', request.url);
      console.log(`[Middleware] Acesso negado - Plano insuficiente. Redirecionando para: ${upgradeUrl}`);
      return NextResponse.redirect(upgradeUrl);
    }
  } else {
    console.log(`[Middleware] Nenhum requisito específico encontrado para: ${pathname}`);
  }

  console.log(`[Middleware] Acesso permitido à rota: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; */

/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  API_AUTH_PREFIX,
  PUBLIC_ROUTES,
  ROUTE_FEATURE_MAPPING,
  TOKEN_COOKIE_KEY,
  PLAN_COOKIE_KEY,
} from "@/constants";
import { featuresByPlan, Plan } from "@/lib/features";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get(TOKEN_COOKIE_KEY)?.value;
  const plan = req.cookies.get(PLAN_COOKIE_KEY)?.value as Plan;
  const isLoggedIn = !!token && !!plan;

  // 1. Verificar rotas públicas primeiro
  if (
    path.startsWith(API_AUTH_PREFIX) ||
    PUBLIC_ROUTES.some(
      (route) =>
        path === route ||
        (route.endsWith("*") && path.startsWith(route.slice(0, -1)))
    )
  ) {
    return NextResponse.next();
  }

  // 2. Verificar autenticação para rotas privadas
  const isPrivateRoute = ROUTE_FEATURE_MAPPING.some((route) =>
    path.startsWith(route.pathPrefix)
  );

  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 3. Verificar plano do usuário para features específicas
  if (isLoggedIn && isPrivateRoute) {
    const features = featuresByPlan[plan] || [];

    const hasAccess = ROUTE_FEATURE_MAPPING.every(({ pathPrefix, feature }) => {
      return !path.startsWith(pathPrefix) || features.includes(feature);
    });

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/upgrade", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
 */
/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  apiAuthPrefix,
  PUBLIC_ROUTES,
  ROUTE_BY_FEATURE,
  TOKEN_COOKIE_KEY,
  PLAN_COOKIE_KEY,
} from "@/constants";
import { featuresByPlan, Plan } from "@/lib/features";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get(TOKEN_COOKIE_KEY)?.value as string;
  const plan = req.cookies.get(PLAN_COOKIE_KEY)?.value as Plan;
  const isLoggedIn = !!token && !!plan;

  const isApiAuthRoute = path.startsWith(apiAuthPrefix);
  const isPublicRoute = PUBLIC_ROUTES.includes(path);
  const isPrivateRoute = ROUTE_BY_FEATURE.some((route) =>
    path.startsWith(route.pathPrefix)
  );

  if (isApiAuthRoute || isPublicRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  console.log("EU TOKEN: " + token);

  if (!plan) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  console.log("PLANO ACTUAL DO USUARIO: " + plan);

  if (isLoggedIn && isPrivateRoute) {
    const features = featuresByPlan[plan] || [];

    for (const { pathPrefix, feature } of ROUTE_BY_FEATURE) {
      if (path.startsWith(pathPrefix) && !features.includes(feature)) {
        return NextResponse.redirect(new URL("/upgrade", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};


//  export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// }; */
