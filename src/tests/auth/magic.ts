// types/auth.ts
export enum SubscriptionPlan {
  BASE = 'base',
  TSUNAMI = 'tsunami',
  SMART_PRO = 'smart_pro'
}

export enum UserRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  CASHIER = 'cashier',
  EMPLOYEE = 'employee'
}

export interface Company {
  id: string;
  name: string;
  subscription: {
    plan: SubscriptionPlan;
    isActive: boolean;
    expiresAt: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  company: Company;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// lib/auth-service.ts
/**
 * Serviço responsável por toda a comunicação com o backend de autenticação.
 * Este serviço abstrai as chamadas à API e gere automaticamente os tokens.
 */
class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  }

  // Método para fazer login com email e password
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro no login');
    }

    return response.json();
  }

  // Método para renovar o token de acesso usando o refresh token
  async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Erro ao renovar token');
    }

    return response.json();
  }

  // Método para fazer logout (invalidar tokens no servidor)
  async logout(refreshToken: string): Promise<void> {
    await fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Método para obter dados atualizados do utilizador
  async getCurrentUser(accessToken: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter dados do utilizador');
    }

    return response.json();
  }
}

export const authService = new AuthService();

// lib/token-storage.ts
/**
 * Classe responsável por gerir o armazenamento seguro dos tokens.
 * Utiliza cookies httpOnly para o refresh token (mais seguro) e 
 * sessionStorage para o access token (acesso rápido).
 */
class TokenStorage {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  // Armazenar tokens após login bem-sucedido
  setTokens(tokens: AuthTokens): void {
    // Access token no sessionStorage para acesso rápido
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    }
    
    // Refresh token em cookie httpOnly (mais seguro)
    this.setRefreshTokenCookie(tokens.refreshToken);
  }

  // Obter access token do sessionStorage
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  // Obter refresh token do cookie
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return this.getCookie(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  // Remover todos os tokens (logout)
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
    this.removeRefreshTokenCookie();
  }

  // Métodos privados para gerir cookies
  private setRefreshTokenCookie(token: string): void {
    if (typeof window !== 'undefined') {
      // Cookie com 7 dias de validade, httpOnly simulado via SameSite=Strict
      document.cookie = `${this.REFRESH_TOKEN_KEY}=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production'}`;
    }
  }

  private removeRefreshTokenCookie(): void {
    if (typeof window !== 'undefined') {
      document.cookie = `${this.REFRESH_TOKEN_KEY}=; Path=/; Max-Age=0`;
    }
  }

  private getCookie(name: string): string | null {
    if (typeof window !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
    }
    return null;
  }
}

export const tokenStorage = new TokenStorage();

// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, AuthTokens, LoginResponse } from '@/types/auth';
import { authService } from '@/lib/auth-service';
import { tokenStorage } from '@/lib/token-storage';

// Definir as ações possíveis no contexto de autenticação
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TOKENS'; payload: AuthTokens }
  | { type: 'LOGIN_SUCCESS'; payload: LoginResponse }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: AuthTokens };

// Estado inicial da autenticação
const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: true,
  isAuthenticated: false,
};

// Reducer para gerir as mudanças de estado
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true 
      };
    
    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        tokens: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

// Interface do contexto
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar se existe sessão ativa quando a aplicação carrega
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (accessToken && refreshToken) {
        try {
          // Tentar obter dados do utilizador com o token atual
          const user = await authService.getCurrentUser(accessToken);
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_TOKENS', payload: { accessToken, refreshToken } });
        } catch (error) {
          // Se o access token expirou, tentar renovar
          try {
            const newTokens = await authService.refreshAccessToken(refreshToken);
            tokenStorage.setTokens(newTokens);
            
            const user = await authService.getCurrentUser(newTokens.accessToken);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tokens: newTokens } });
          } catch (refreshError) {
            // Se não conseguir renovar, fazer logout
            tokenStorage.clearTokens();
            dispatch({ type: 'LOGOUT' });
          }
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authService.login(email, password);
      
      // Armazenar tokens de forma segura
      tokenStorage.setTokens(response.tokens);
      
      // Atualizar estado da aplicação
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Função de logout
  const logout = async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        console.error('Erro ao fazer logout no servidor:', error);
      }
    }
    
    tokenStorage.clearTokens();
    dispatch({ type: 'LOGOUT' });
  };

  // Função para renovar o access token
  const refreshToken = async (): Promise<void> => {
    const currentRefreshToken = tokenStorage.getRefreshToken();
    
    if (!currentRefreshToken) {
      throw new Error('Refresh token não encontrado');
    }
    
    try {
      const newTokens = await authService.refreshAccessToken(currentRefreshToken);
      tokenStorage.setTokens(newTokens);
      dispatch({ type: 'REFRESH_TOKEN_SUCCESS', payload: newTokens });
    } catch (error) {
      // Se não conseguir renovar, fazer logout
      await logout();
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// config/plan-features.ts
/**
 * Configuração das funcionalidades disponíveis para cada plano.
 * Esta estrutura permite fácil manutenção e adição de novos recursos.
 */
export const PLAN_FEATURES = {
  [SubscriptionPlan.BASE]: [
    'invoicing',
    'services',
    'dashboard'
  ],
  [SubscriptionPlan.TSUNAMI]: [
    'invoicing',
    'services',
    'dashboard',
    'pos',
    'inventory',
    'customers',
    'reports'
  ],
  [SubscriptionPlan.SMART_PRO]: [
    'invoicing',
    'services',
    'dashboard',
    'pos',
    'inventory',
    'customers',
    'reports',
    'smart_reports',
    'advanced_analytics',
    'api_access',
    'integrations',
    'bulk_operations'
  ]
} as const;

/**
 * Mapeamento das rotas para as funcionalidades necessárias.
 * Cada rota define quais features são obrigatórias para acesso.
 */
export const ROUTE_FEATURES = {
  '/dashboard': ['dashboard'],
  '/invoicing': ['invoicing'],
  '/services': ['services'],
  '/pos': ['pos'],
  '/inventory': ['inventory'],
  '/customers': ['customers'],
  '/reports': ['reports'],
  '/reports/smart': ['smart_reports'],
  '/analytics': ['advanced_analytics'],
  '/integrations': ['integrations']
} as const;

// hooks/useSubscription.ts
import { useAuth } from '@/contexts/AuthContext';
import { PLAN_FEATURES, ROUTE_FEATURES } from '@/config/plan-features';
import { SubscriptionPlan } from '@/types/auth';

/**
 * Hook personalizado para gerir permissões baseadas na subscrição.
 * Este hook oferece uma interface simples para verificar acesso a funcionalidades.
 */
export function useSubscription() {
  const { user, isAuthenticated } = useAuth();
  
  const currentPlan = user?.company?.subscription?.plan;
  const isSubscriptionActive = user?.company?.subscription?.isActive ?? false;
  
  /**
   * Verifica se o utilizador tem acesso a uma funcionalidade específica.
   * @param feature - Nome da funcionalidade a verificar
   * @returns true se tiver acesso, false caso contrário
   */
  const hasFeature = (feature: string): boolean => {
    if (!isAuthenticated || !currentPlan || !isSubscriptionActive) {
      return false;
    }
    
    const planFeatures = PLAN_FEATURES[currentPlan as SubscriptionPlan];
    return planFeatures?.includes(feature) || false;
  };
  
  /**
   * Verifica se o utilizador pode aceder a uma rota específica.
   * @param route - Caminho da rota a verificar
   * @returns true se tiver acesso, false caso contrário
   */
  const canAccessRoute = (route: string): boolean => {
    const requiredFeatures = ROUTE_FEATURES[route as keyof typeof ROUTE_FEATURES];
    
    // Se a rota não tem restrições específicas, permitir acesso
    if (!requiredFeatures) return true;
    
    // Verificar se tem todas as funcionalidades necessárias
    return requiredFeatures.every(feature => hasFeature(feature));
  };
  
  /**
   * Obter lista completa de funcionalidades disponíveis no plano atual.
   * @returns Array com todas as funcionalidades disponíveis
   */
  const getAvailableFeatures = (): string[] => {
    if (!currentPlan || !isSubscriptionActive) {
      return [];
    }
    
    return PLAN_FEATURES[currentPlan as SubscriptionPlan] || [];
  };
  
  /**
   * Verificar se o plano atual é superior ou igual ao plano especificado.
   * @param targetPlan - Plano para comparação
   * @returns true se o plano atual for superior ou igual
   */
  const hasMinimumPlan = (targetPlan: SubscriptionPlan): boolean => {
    if (!currentPlan || !isSubscriptionActive) return false;
    
    const planHierarchy = [
      SubscriptionPlan.BASE,
      SubscriptionPlan.TSUNAMI,
      SubscriptionPlan.SMART_PRO
    ];
    
    const currentIndex = planHierarchy.indexOf(currentPlan as SubscriptionPlan);
    const targetIndex = planHierarchy.indexOf(targetPlan);
    
    return currentIndex >= targetIndex;
  };
  
  return {
    currentPlan,
    isSubscriptionActive,
    hasFeature,
    canAccessRoute,
    getAvailableFeatures,
    hasMinimumPlan,
    company: user?.company,
    user: user
  };
}

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTE_FEATURES, PLAN_FEATURES } from '@/config/plan-features';

/**
 * Middleware para proteger rotas baseadas em autenticação e planos de subscrição.
 * Este middleware funciona como uma camada de segurança adicional no servidor.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Definir quais rotas precisam de proteção
  const protectedRoutes = [
    '/dashboard', '/invoicing', '/services', '/pos', 
    '/inventory', '/customers', '/reports', '/analytics', '/integrations'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Se não for rota protegida, permitir acesso
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Verificar se tem access token
  const accessToken = request.cookies.get('access_token')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!accessToken) {
    // Redirecionar para login se não estiver autenticado
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  try {
    // Verificar validade do token e obter dados do utilizador
    const response = await fetch(`${process.env.API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Token inválido');
    }
    
    const userData = await response.json();
    
    // Verificar se a subscrição está ativa
    if (!userData.company?.subscription?.isActive) {
      return NextResponse.redirect(new URL('/subscription-expired', request.url));
    }
    
    // Verificar permissões para a rota específica
    const requiredFeatures = ROUTE_FEATURES[pathname as keyof typeof ROUTE_FEATURES];
    
    if (requiredFeatures) {
      const currentPlan = userData.company.subscription.plan;
      const availableFeatures = PLAN_FEATURES[currentPlan] || [];
      
      const hasAccess = requiredFeatures.every(feature => 
        availableFeatures.includes(feature)
      );
      
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/upgrade-plan', request.url));
      }
    }
    
    // Adicionar dados do utilizador aos headers para uso nos componentes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-data', JSON.stringify(userData));
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
  } catch (error) {
    console.error('Middleware authentication error:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|_static|favicon.ico|sitemap.xml|login|register|upgrade-plan|subscription-expired).*)',
  ],
};

// components/ProtectedRoute.tsx
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredFeature?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteger rotas ou secções baseadas em funcionalidades.
 * Este componente oferece proteção tanto ao nível de autenticação quanto de planos.
 */
export function ProtectedRoute({ 
  children, 
  requiredFeature, 
  fallback,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasFeature, isSubscriptionActive } = useSubscription();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);
  
  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">A carregar...</div>
      </div>
    );
  }
  
  // Redirecionar se não estiver autenticado
  if (!isAuthenticated) {
    return null;
  }
  
  // Verificar se a subscrição está ativa
  if (!isSubscriptionActive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Subscrição Expirada</h2>
          <p>Por favor, renove o seu plano para continuar a usar a aplicação.</p>
        </div>
      </div>
    );
  }
  
  // Verificar se tem a funcionalidade necessária
  if (requiredFeature && !hasFeature(requiredFeature)) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Funcionalidade Não Disponível</h3>
              <p className="text-gray-600">
                Esta funcionalidade não está incluída no seu plano atual.
              </p>
            </div>
          </div>
        )}
      </>
    );
  }
  
  return <>{children}</>;
}

// components/FeatureGate.tsx
"use client";

import { useSubscription } from '@/hooks/useSubscription';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

/**
 * Componente para controlar a visibilidade de funcionalidades específicas.
 * Ideal para ocultar botões, menus ou secções baseadas no plano do utilizador.
 */
export function FeatureGate({ 
  feature, 
  children, 
  fallback,
  showUpgrade = false 
}: FeatureGateProps) {
  const { hasFeature, currentPlan } = useSubscription();
  
  if (!hasFeature(feature)) {
    if (showUpgrade) {
      return (
        <div className="relative">
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded">
            <span className="text-sm font-medium px-3 py-1 bg-blue-600 text-white rounded">
              Upgrade para {currentPlan === 'base' ? 'Tsunami' : 'Smart Pro'}
            </span>
          </div>
        </div>
      );
    }
    
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}