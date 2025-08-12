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
  } else if (feature) {
    // Verificação apenas de funcionalidade (plano)
    hasAccess = hasFeature(feature);
    if (!hasAccess) denialReason = 'plano';
  } else if (permission) {
    // Verificação apenas de permissão (role)
    hasAccess = hasPermission(permission);
    if (!hasAccess) denialReason = 'permissão';
  }
  
  if (!hasAccess) {
    if (showUpgrade && denialReason === 'plano') {
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

// Exemplos de uso prático dos componentes

// components/examples/UserManagementButton.tsx
"use client";

import { PermissionGate } from '@/components/PermissionGate';

export function UserManagementButton() {
  return (
    <PermissionGate permission="manage_users">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Gerir Utilizadores
      </button>
    </PermissionGate>
  );
}

// components/examples/POSSection.tsx  
"use client";

import { PermissionGate } from '@/components/PermissionGate';

export function POSSection() {
  return (
    <PermissionGate 
      feature="pos" 
      permission="manage_pos"
      fallback={
        <div className="p-4 bg-gray-100 rounded">
          POS não disponível no seu plano ou você não tem permissão.
        </div>
      }
    >
      <div className="pos-interface">
        {/* Interface do POS aqui */}
        <h2>Sistema de Vendas (POS)</h2>
        <button>Nova Venda</button>
      </div>
    </PermissionGate>
  );
}

// components/examples/FinancialReports.tsx
"use client";

import { PermissionGate } from '@/components/PermissionGate';

export function FinancialReports() {
  return (
    <PermissionGate 
      feature="reports" 
      permission="view_financial_reports"
      fallback={
        <div className="text-center p-8">
          <p>Apenas proprietários e gerentes podem ver relatórios financeiros.</p>
        </div>
      }
    >
      <div className="financial-reports">
        <h2>Relatórios Financeiros</h2>
        {/* Conteúdo sensível dos relatórios */}
      </div>
    </PermissionGate>
  );
}

// middleware.ts (atualizado para usar o novo sistema)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTE_PERMISSIONS, PLAN_FEATURES, ROLE_PERMISSIONS } from '@/config/permissions';

/**
 * Middleware avançado que implementa verificação em duas camadas:
 * 1. Plano da empresa (o que a empresa pode aceder)
 * 2. Role do utilizador (o que ele pode fazer)
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Verificar se a rota precisa de proteção
  const routeConfig = ROUTE_PERMISSIONS[pathname as keyof typeof ROUTE_PERMISSIONS];
  
  // Se não há configuração para a rota, é pública
  if (!routeConfig) {
    return NextResponse.next();
  }
  
  // Verificar autenticação
  const accessToken = request.cookies.get('access_token')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  try {
    // Obter dados do utilizador do backend
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
    
    // Primeira camada: verificar se o plano inclui as funcionalidades necessárias
    const currentPlan = userData.company.subscription.plan;
    const planFeatures = PLAN_FEATURES[currentPlan] || [];
    
    const hasRequiredFeatures = routeConfig.requiredFeatures.every(feature =>
      planFeatures.includes(feature)
    );
    
    if (!hasRequiredFeatures) {
      return NextResponse.redirect(new URL('/upgrade-plan', request.url));
    }
    
    // Segunda camada: verificar se o role tem as permissões necessárias
    const currentRole = userData.role;
    const rolePermissions = ROLE_PERMISSIONS[currentRole] || [];
    
    const hasRequiredPermissions = routeConfig.requiredPermissions.every(permission =>
      rolePermissions.includes(permission)
    );
    
    if (!hasRequiredPermissions) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
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
    '/((?!api|_next|_static|favicon.ico|sitemap.xml|login|register|upgrade-plan|subscription-expired|access-denied).*)',
  ],
};

// components/NavigationMenu.tsx - Exemplo de menu dinâmico
"use client";

import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGate } from '@/components/PermissionGate';
import Link from 'next/link';

export function NavigationMenu() {
  const { canAccessRoute, hasFeature, hasPermission } = usePermissions();
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex space-x-4">
        {/* Dashboard - todos podem ver */}
        <Link href="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        
        {/* Faturação - precisa da funcionalidade e permissão para ver */}
        <PermissionGate feature="invoicing" permission="view_invoice">
          <Link href="/invoicing" className="hover:text-gray-300">
            Faturação
          </Link>
        </PermissionGate>
        
        {/* POS - só quem pode usar o POS */}
        <PermissionGate feature="pos" permission="manage_pos">
          <Link href="/pos" className="hover:text-gray-300">
            POS
          </Link>
        </PermissionGate>
        
        {/* Relatórios - com submenus baseados em permissões */}
        <PermissionGate feature="reports" permission="view_reports">
          <div className="relative group">
            <span className="hover:text-gray-300 cursor-pointer">Relatórios</span>
            <div className="absolute top-full left-0 bg-gray-700 rounded shadow-lg hidden group-hover:block">
              <Link href="/reports" className="block px-4 py-2 hover:bg-gray-600">
                Relatórios Básicos
              </Link>
              
              {/* Relatórios financeiros - só para owner e manager */}
              <PermissionGate permission="view_financial_reports">
                <Link href="/reports/financial" className="block px-4 py-2 hover:bg-gray-600">
                  Relatórios Financeiros
                </Link>
              </PermissionGate>
              
              {/* Relatórios inteligentes - precisa do plano Smart Pro */}
              <PermissionGate feature="smart_reports" permission="view_reports">
                <Link href="/reports/smart" className="block px-4 py-2 hover:bg-gray-600">
                  Relatórios Inteligentes
                </Link>
              </PermissionGate>
            </div>
          </div>
        </PermissionGate>
        
        {/* Gestão de utilizadores - só para owner e manager */}
        <PermissionGate permission="manage_users">
          <Link href="/users" className="hover:text-gray-300">
            Utilizadores
          </Link>
        </PermissionGate>
        
        {/* Configurações - só para owner */}
        <PermissionGate permission="manage_settings">
          <Link href="/settings" className="hover:text-gray-300">
            Configurações
          </Link>
        </PermissionGate>
      </div>
    </nav>
  );
}

// utils/permission-helpers.ts - Utilitários para casos especiais
import { UserRole } from '@/types/auth';

/**
 * Função para verificar se um utilizador pode gerir outro utilizador.
 * Owners podem gerir todos, managers podem gerir cashiers e employees.
 */
export function canManageUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
  // Owner pode gerir todos
  if (currentUserRole === UserRole.OWNER) {
    return true;
  }
  
  // Manager pode gerir cashiers e employees
  if (currentUserRole === UserRole.MANAGER) {
    return targetUserRole === UserRole.CASHIER || targetUserRole === UserRole.EMPLOYEE;
  }
  
  // Outros roles não podem gerir utilizadores
  return false;
}

/**
 * Função para obter os roles que um utilizador pode atribuir.
 */
export function getAssignableRoles(currentUserRole: UserRole): UserRole[] {
  switch (currentUserRole) {
    case UserRole.OWNER:
      // Owner pode criar qualquer role exceto outro owner
      return [UserRole.MANAGER, UserRole.CASHIER, UserRole.EMPLOYEE];
    
    case UserRole.MANAGER:
      // Manager pode criar apenas roles inferiores
      return [UserRole.CASHIER, UserRole.EMPLOYEE];
    
    default:
      // Outros não podem criar utilizadores
      return [];
  }
}

/**
 * Hook personalizado para gestão de utilizadores com regras específicas.
 */
import { usePermissions } from '@/hooks/usePermissions';

export function useUserManagement() {
  const { user, hasPermission } = usePermissions();
  
  const canCreateUser = () => hasPermission('manage_users');
  
  const canEditUser = (targetUserRole: UserRole) => {
    if (!hasPermission('manage_users')) return false;
    return canManageUser(user?.role as UserRole, targetUserRole);
  };
  
  const canDeleteUser = (targetUserRole: UserRole) => {
    if (!hasPermission('manage_users')) return false;
    return canManageUser(user?.role as UserRole, targetUserRole);
  };
  
  const availableRoles = getAssignableRoles(user?.role as UserRole);
  
  return {
    canCreateUser,
    canEditUser,
    canDeleteUser,
    availableRoles
  };
}plan: SubscriptionPlan;
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

// config/permissions.ts
/**
 * Configuração completa de permissões que combina planos de subscrição com roles de utilizador.
 * Este sistema de duas camadas garante que tanto as limitações do plano quanto as
 * responsabilidades organizacionais sejam respeitadas.
 */

// Funcionalidades disponíveis por plano de subscrição
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
 * Ações específicas que cada role pode executar dentro de cada funcionalidade.
 * Esta é a camada de granularidade que define "o que" cada tipo de utilizador pode fazer.
 */
export const ROLE_PERMISSIONS = {
  [UserRole.OWNER]: [
    // Gestão da empresa e utilizadores
    'manage_company',
    'manage_users',
    'manage_roles',
    'manage_subscription',
    'view_financial_reports',
    'manage_settings',
    'export_data',
    'manage_integrations',
    
    // Todas as operações comerciais
    'create_invoice',
    'edit_invoice',
    'delete_invoice',
    'view_invoice',
    'manage_services',
    'manage_customers',
    'manage_inventory',
    'process_payments',
    'manage_pos',
    'view_reports',
    'create_reports'
  ],
  
  [UserRole.MANAGER]: [
    // Gestão operacional limitada
    'manage_users', // Pode gerir apenas utilizadores de nível inferior
    'view_financial_reports',
    'manage_customers',
    'manage_inventory',
    'manage_services',
    
    // Operações comerciais completas
    'create_invoice',
    'edit_invoice',
    'delete_invoice',
    'view_invoice',
    'process_payments',
    'manage_pos',
    'view_reports',
    'create_reports'
  ],
  
  [UserRole.CASHIER]: [
    // Operações de venda e caixa
    'create_invoice',
    'view_invoice',
    'process_payments',
    'manage_pos',
    'view_customers',
    'view_inventory',
    'view_basic_reports'
  ],
  
  [UserRole.EMPLOYEE]: [
    // Operações básicas apenas
    'create_invoice',
    'view_invoice',
    'view_customers',
    'view_inventory'
  ]
} as const;

/**
 * Mapeamento das rotas para os recursos necessários (planos) e ações necessárias (roles).
 * Esta estrutura permite verificação granular: primeiro se o plano da empresa inclui
 * a funcionalidade, depois se o role do utilizador permite a ação específica.
 */
export const ROUTE_PERMISSIONS = {
  // Dashboard - todos podem ver, mas conteúdo varia por role
  '/dashboard': {
    requiredFeatures: ['dashboard'],
    requiredPermissions: [] // Todos os utilizadores autenticados podem ver o dashboard
  },
  
  // Faturação
  '/invoicing': {
    requiredFeatures: ['invoicing'],
    requiredPermissions: ['view_invoice']
  },
  '/invoicing/create': {
    requiredFeatures: ['invoicing'],
    requiredPermissions: ['create_invoice']
  },
  '/invoicing/edit': {
    requiredFeatures: ['invoicing'],
    requiredPermissions: ['edit_invoice']
  },
  
  // Serviços
  '/services': {
    requiredFeatures: ['services'],
    requiredPermissions: ['view_invoice'] // Serviços estão ligados à faturação
  },
  '/services/manage': {
    requiredFeatures: ['services'],
    requiredPermissions: ['manage_services']
  },
  
  // POS (Point of Sale)
  '/pos': {
    requiredFeatures: ['pos'],
    requiredPermissions: ['manage_pos']
  },
  
  // Inventário
  '/inventory': {
    requiredFeatures: ['inventory'],
    requiredPermissions: ['view_inventory']
  },
  '/inventory/manage': {
    requiredFeatures: ['inventory'],
    requiredPermissions: ['manage_inventory']
  },
  
  // Clientes
  '/customers': {
    requiredFeatures: ['customers'],
    requiredPermissions: ['view_customers']
  },
  '/customers/manage': {
    requiredFeatures: ['customers'],
    requiredPermissions: ['manage_customers']
  },
  
  // Relatórios
  '/reports': {
    requiredFeatures: ['reports'],
    requiredPermissions: ['view_reports']
  },
  '/reports/smart': {
    requiredFeatures: ['smart_reports'],
    requiredPermissions: ['view_reports']
  },
  '/reports/financial': {
    requiredFeatures: ['reports'],
    requiredPermissions: ['view_financial_reports']
  },
  
  // Gestão de utilizadores - só owner e manager (com limitações)
  '/users': {
    requiredFeatures: ['dashboard'], // Funcionalidade básica
    requiredPermissions: ['manage_users']
  },
  
  // Configurações da empresa - só owner
  '/settings': {
    requiredFeatures: ['dashboard'],
    requiredPermissions: ['manage_settings']
  },
  
  // Gestão de subscrição - só owner
  '/subscription': {
    requiredFeatures: ['dashboard'],
    requiredPermissions: ['manage_subscription']
  }
} as const;

// hooks/usePermissions.ts
import { useAuth } from '@/contexts/AuthContext';
import { PLAN_FEATURES, ROLE_PERMISSIONS, ROUTE_PERMISSIONS } from '@/config/permissions';
import { SubscriptionPlan, UserRole } from '@/types/auth';

/**
 * Hook avançado para gerir permissões baseadas tanto em planos quanto em roles.
 * Este hook implementa um sistema de duas camadas: primeiro verifica se o plano da empresa
 * inclui a funcionalidade, depois verifica se o role do utilizador permite a ação específica.
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  
  const currentPlan = user?.company?.subscription?.plan;
  const currentRole = user?.role;
  const isSubscriptionActive = user?.company?.subscription?.isActive ?? false;
  
  /**
   * Verifica se o plano da empresa inclui uma funcionalidade específica.
   * Esta é a primeira camada de verificação - o plano de subscrição.
   * @param feature - Nome da funcionalidade a verificar (ex: 'pos', 'inventory')
   * @returns true se o plano incluir a funcionalidade, false caso contrário
   */
  const hasFeature = (feature: string): boolean => {
    if (!isAuthenticated || !currentPlan || !isSubscriptionActive) {
      return false;
    }
    
    const planFeatures = PLAN_FEATURES[currentPlan as SubscriptionPlan];
    return planFeatures?.includes(feature) || false;
  };
  
  /**
   * Verifica se o role do utilizador permite uma ação específica.
   * Esta é a segunda camada de verificação - as responsabilidades organizacionais.
   * @param permission - Nome da permissão a verificar (ex: 'manage_users', 'create_invoice')
   * @returns true se o role permitir a ação, false caso contrário
   */
  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !currentRole) {
      return false;
    }
    
    const rolePermissions = ROLE_PERMISSIONS[currentRole as UserRole];
    return rolePermissions?.includes(permission) || false;
  };
  
  /**
   * Verificação completa que combina planos e roles.
   * Primeiro verifica se o plano da empresa inclui a funcionalidade,
   * depois verifica se o role do utilizador permite a ação específica.
   * @param feature - Funcionalidade necessária do plano
   * @param permission - Permissão necessária do role
   * @returns true se ambas as condições forem satisfeitas
   */
  const canPerformAction = (feature: string, permission: string): boolean => {
    return hasFeature(feature) && hasPermission(permission);
  };
  
  /**
   * Verifica se o utilizador pode aceder a uma rota específica.
   * Esta função implementa a lógica completa: verifica o plano E o role.
   * @param route - Caminho da rota a verificar
   * @returns true se tiver acesso completo, false caso contrário
   */
  const canAccessRoute = (route: string): boolean => {
    const routeConfig = ROUTE_PERMISSIONS[route as keyof typeof ROUTE_PERMISSIONS];
    
    // Se a rota não está configurada, permitir acesso (rota pública)
    if (!routeConfig) return true;
    
    // Verificar se o plano inclui todas as funcionalidades necessárias
    const hasAllFeatures = routeConfig.requiredFeatures.every(feature => 
      hasFeature(feature)
    );
    
    // Se não tem as funcionalidades do plano, negar acesso
    if (!hasAllFeatures) return false;
    
    // Se não há permissões específicas necessárias, permitir acesso
    if (routeConfig.requiredPermissions.length === 0) return true;
    
    // Verificar se o role tem todas as permissões necessárias
    const hasAllPermissions = routeConfig.requiredPermissions.every(permission =>
      hasPermission(permission)
    );
    
    return hasAllPermissions;
  };
  
  /**
   * Obtém todas as funcionalidades disponíveis no plano atual.
   * Útil para construir menus dinâmicos baseados no plano.
   * @returns Array com todas as funcionalidades do plano
   */
  const getAvailableFeatures = (): string[] => {
    if (!currentPlan || !isSubscriptionActive) {
      return [];
    }
    
    return PLAN_FEATURES[currentPlan as SubscriptionPlan] || [];
  };
  
  /**
   * Obtém todas as permissões disponíveis para o role atual.
   * Útil para debug ou construção de interfaces administrativas.
   * @returns Array com todas as permissões do role
   */
  const getAvailablePermissions = (): string[] => {
    if (!currentRole) {
      return [];
    }
    
    return ROLE_PERMISSIONS[currentRole as UserRole] || [];
  };
  
  /**
   * Verifica se o utilizador é proprietário da empresa.
   * Atalho útil para verificações frequentes.
   * @returns true se for owner, false caso contrário
   */
  const isOwner = (): boolean => {
    return currentRole === UserRole.OWNER;
  };
  
  /**
   * Verifica se o utilizador tem role de gestão (owner ou manager).
   * Útil para funcionalidades que requerem responsabilidade de gestão.
   * @returns true se for owner ou manager, false caso contrário
   */
  const isManager = (): boolean => {
    return currentRole === UserRole.OWNER || currentRole === UserRole.MANAGER;
  };
  
  /**
   * Verifica se o plano atual é superior ou igual ao plano especificado.
   * Útil para mostrar opções de upgrade ou funcionalidades futuras.
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
    // Estado atual
    currentPlan,
    currentRole,
    isSubscriptionActive,
    
    // Verificações básicas
    hasFeature,
    hasPermission,
    canPerformAction,
    canAccessRoute,
    
    // Verificações de conveniência
    isOwner,
    isManager,
    hasMinimumPlan,
    
    // Informações úteis
    getAvailableFeatures,
    getAvailablePermissions,
    
    // Dados do contexto
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
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredFeature?: string;
  requiredPermission?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente avançado para proteger rotas baseadas tanto em planos quanto em roles.
 * Este componente implementa verificação em duas camadas: primeiro o plano da empresa
 * (o que a empresa pode aceder), depois o role do utilizador (o que ele pode fazer).
 */
export function ProtectedRoute({ 
  children, 
  requiredFeature, 
  requiredPermission,
  fallback,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasFeature, hasPermission, isSubscriptionActive, canPerformAction } = usePermissions();
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
  
  // Verificação completa: tanto funcionalidade quanto permissão
  if (requiredFeature && requiredPermission) {
    if (!canPerformAction(requiredFeature, requiredPermission)) {
      const hasFeatureAccess = hasFeature(requiredFeature);
      const hasPermissionAccess = hasPermission(requiredPermission);
      
      let message = '';
      if (!hasFeatureAccess && !hasPermissionAccess) {
        message = 'Esta funcionalidade não está disponível no seu plano e você não tem permissão para acedê-la.';
      } else if (!hasFeatureAccess) {
        message = 'Esta funcionalidade não está incluída no seu plano atual.';
      } else if (!hasPermissionAccess) {
        message = 'Você não tem permissão para aceder a esta funcionalidade.';
      }
      
      return (
        <>
          {fallback || (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Acesso Negado</h3>
                <p className="text-gray-600">{message}</p>
              </div>
            </div>
          )}
        </>
      );
    }
  } else if (requiredFeature && !hasFeature(requiredFeature)) {
    // Apenas verificação de funcionalidade (plano)
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
  } else if (requiredPermission && !hasPermission(requiredPermission)) {
    // Apenas verificação de permissão (role)
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Permissão Insuficiente</h3>
              <p className="text-gray-600">
                Você não tem permissão para aceder a esta funcionalidade.
              </p>
            </div>
          </div>
        )}
      </>
    );
  }
  
  return <>{children}</>;
}

// components/PermissionGate.tsx
"use client";

import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGateProps {
  feature?: string;
  permission?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

/**
 * Componente granular para controlar visibilidade baseada em planos e/ou roles.
 * Este componente oferece controlo fino sobre que utilizadores veem que conteúdo,
 * permitindo verificar separadamente o plano da empresa e as permissões do utilizador.
 */
export function PermissionGate({ 
  feature,
  permission,
  children, 
  fallback,
  showUpgrade = false 
}: PermissionGateProps) {
  const { 
    hasFeature, 
    hasPermission, 
    canPerformAction, 
    currentPlan,
    currentRole 
  } = usePermissions();
  
  // Determinar se tem acesso baseado nos parâmetros fornecidos
  let hasAccess = true;
  let denialReason = '';
  
  if (feature && permission) {
    // Verificação completa: plano E role
    hasAccess = canPerformAction(feature, permission);
    if (!hasAccess) {
      const hasFeatureAccess = hasFeature(feature);
      const hasPermissionAccess = hasPermission(permission);
      
      if (!hasFeatureAccess) {
        denialReason = 'plano';
      } else if (!hasPermissionAccess) {
        denialReason = 'permissão';
      }