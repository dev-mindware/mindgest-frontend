// components/sidebar/Sidebar.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGate } from '@/components/PermissionGate';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3,
  Settings,
  CreditCard,
  Building2,
  ChevronDown,
  ChevronRight,
  Crown,
  Shield,
  User,
  Zap,
  Lock
} from 'lucide-react';

/**
 * Interface que define a estrutura de um item do menu.
 * Esta estrutura permite criar menus hierárquicos com verificações
 * granulares de permissões e funcionalidades.
 */
interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  feature?: string;           // Funcionalidade necessária do plano
  permission?: string;        // Permissão necessária do role
  children?: MenuItem[];      // Submenus
  badge?: string;            // Badge para indicar novidades ou status
  description?: string;       // Descrição para tooltips
}

/**
 * Configuração completa do menu da sidebar.
 * Esta estrutura define toda a navegação da aplicação, incluindo
 * as permissões necessárias para cada item.
 */
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral da sua empresa'
  },
  {
    id: 'invoicing',
    label: 'Faturação',
    icon: FileText,
    feature: 'invoicing',
    permission: 'view_invoice',
    description: 'Gerir faturas e documentos fiscais',
    children: [
      {
        id: 'invoicing-list',
        label: 'Listar Faturas',
        href: '/invoicing',
        icon: FileText,
        feature: 'invoicing',
        permission: 'view_invoice'
      },
      {
        id: 'invoicing-create',
        label: 'Nova Fatura',
        href: '/invoicing/create',
        icon: FileText,
        feature: 'invoicing',
        permission: 'create_invoice'
      },
      {
        id: 'services',
        label: 'Serviços',
        href: '/services',
        icon: ShoppingCart,
        feature: 'services',
        permission: 'view_invoice'
      }
    ]
  },
  {
    id: 'sales',
    label: 'Vendas',
    icon: ShoppingCart,
    children: [
      {
        id: 'pos',
        label: 'Ponto de Venda (POS)',
        href: '/pos',
        icon: ShoppingCart,
        feature: 'pos',
        permission: 'manage_pos',
        badge: 'Tsunami+',
        description: 'Sistema de vendas rápidas'
      },
      {
        id: 'customers',
        label: 'Clientes',
        href: '/customers',
        icon: Users,
        feature: 'customers',
        permission: 'view_customers',
        badge: 'Tsunami+'
      }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventário',
    href: '/inventory',
    icon: Package,
    feature: 'inventory',
    permission: 'view_inventory',
    badge: 'Tsunami+',
    description: 'Controlo de stock e produtos'
  },
  {
    id: 'reports',
    label: 'Relatórios',
    icon: BarChart3,
    feature: 'reports',
    permission: 'view_reports',
    description: 'Análises e relatórios empresariais',
    children: [
      {
        id: 'reports-basic',
        label: 'Relatórios Básicos',
        href: '/reports',
        icon: BarChart3,
        feature: 'reports',
        permission: 'view_reports'
      },
      {
        id: 'reports-financial',
        label: 'Relatórios Financeiros',
        href: '/reports/financial',
        icon: CreditCard,
        feature: 'reports',
        permission: 'view_financial_reports',
        description: 'Apenas para proprietários e gerentes'
      },
      {
        id: 'reports-smart',
        label: 'Relatórios Inteligentes',
        href: '/reports/smart',
        icon: Zap,
        feature: 'smart_reports',
        permission: 'view_reports',
        badge: 'Smart Pro',
        description: 'IA e análises avançadas'
      }
    ]
  },
  {
    id: 'management',
    label: 'Gestão',
    icon: Building2,
    children: [
      {
        id: 'users',
        label: 'Utilizadores',
        href: '/users',
        icon: Users,
        permission: 'manage_users',
        description: 'Gerir equipa e permissões'
      },
      {
        id: 'company',
        label: 'Empresa',
        href: '/company',
        icon: Building2,
        permission: 'manage_company',
        description: 'Configurações da empresa'
      },
      {
        id: 'subscription',
        label: 'Subscrição',
        href: '/subscription',
        icon: Crown,
        permission: 'manage_subscription',
        description: 'Gerir plano e pagamentos'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Configurações',
    href: '/settings',
    icon: Settings,
    permission: 'manage_settings',
    description: 'Configurações avançadas do sistema'
  }
];

/**
 * Componente individual para cada item do menu.
 * Este componente decide como renderizar cada item baseado nas permissões
 * e implementa estados visuais diferentes para diferentes situações.
 */
interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  level: number;
  onToggle?: () => void;
  isExpanded?: boolean;
}

function SidebarItem({ item, isActive, level, onToggle, isExpanded }: SidebarItemProps) {
  const { hasFeature, hasPermission, canPerformAction, currentPlan, currentRole } = usePermissions();
  
  // Determinar se o item deve ser visível
  const shouldShow = () => {
    // Se não tem requisitos específicos, mostrar sempre
    if (!item.feature && !item.permission) return true;
    
    // Se tem ambos os requisitos, verificar ambos
    if (item.feature && item.permission) {
      return canPerformAction(item.feature, item.permission);
    }
    
    // Se tem apenas requisito de funcionalidade
    if (item.feature) return hasFeature(item.feature);
    
    // Se tem apenas requisito de permissão
    if (item.permission) return hasPermission(item.permission);
    
    return true;
  };
  
  // Determinar o estado de acesso para efeitos visuais
  const getAccessState = () => {
    if (!item.feature && !item.permission) return 'full';
    
    if (item.feature && item.permission) {
      const hasFeatureAccess = hasFeature(item.feature);
      const hasPermissionAccess = hasPermission(item.permission);
      
      if (hasFeatureAccess && hasPermissionAccess) return 'full';
      if (!hasFeatureAccess && !hasPermissionAccess) return 'blocked-both';
      if (!hasFeatureAccess) return 'blocked-plan';
      return 'blocked-permission';
    }
    
    if (item.feature) return hasFeature(item.feature) ? 'full' : 'blocked-plan';
    if (item.permission) return hasPermission(item.permission) ? 'full' : 'blocked-permission';
    
    return 'full';
  };
  
  const accessState = getAccessState();
  const show = shouldShow();
  
  // Se não deve mostrar, não renderizar
  if (!show && accessState !== 'full') return null;
  
  // Estilos baseados no estado de acesso
  const getItemStyles = () => {
    const baseStyles = `
      flex items-center w-full px-3 py-2 rounded-lg text-sm transition-all duration-200
      hover:bg-gray-100 dark:hover:bg-gray-800
    `;
    
    if (accessState === 'full') {
      return isActive 
        ? `${baseStyles} bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium`
        : `${baseStyles} text-gray-700 dark:text-gray-300`;
    }
    
    return `${baseStyles} opacity-50 cursor-not-allowed text-gray-400`;
  };
  
  // Renderizar ícone com indicadores visuais
  const renderIcon = () => {
    const iconStyles = accessState === 'full' 
      ? "w-5 h-5 mr-3" 
      : "w-5 h-5 mr-3 opacity-60";
    
    const IconComponent = item.icon;
    
    return (
      <div className="relative">
        <IconComponent className={iconStyles} />
        {accessState === 'blocked-plan' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
            <Crown className="w-2 h-2 text-white" />
          </div>
        )}
        {accessState === 'blocked-permission' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <Lock className="w-2 h-2 text-white" />
          </div>
        )}
      </div>
    );
  };
  
  // Se tem filhos, renderizar como expandível
  if (item.children && item.children.length > 0) {
    return (
      <div className="mb-1">
        <button
          onClick={onToggle}
          className={getItemStyles()}
          disabled={accessState !== 'full'}
          title={item.description}
        >
          {renderIcon()}
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
              {item.badge}
            </span>
          )}
          {accessState === 'full' && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </button>
        
        {isExpanded && accessState === 'full' && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <SidebarItemRenderer key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Item simples com link
  if (item.href && accessState === 'full') {
    return (
      <Link
        href={item.href}
        className={`${getItemStyles()} mb-1 block`}
        title={item.description}
      >
        {renderIcon()}
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  }
  
  // Item bloqueado - mostrar como desabilitado
  return (
    <div
      className={`${getItemStyles()} mb-1 relative group`}
      title={`${item.description || item.label} - ${
        accessState === 'blocked-plan' 
          ? 'Funcionalidade não incluída no seu plano'
          : 'Sem permissão para aceder'
      }`}
    >
      {renderIcon()}
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-400 rounded-full">
          {item.badge}
        </span>
      )}
      
      {/* Tooltip informativo */}
      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
        {accessState === 'blocked-plan' && (
          <>
            <div className="font-medium">Upgrade Necessário</div>
            <div>Funcionalidade: {item.feature}</div>
            <div>Plano atual: {currentPlan}</div>
          </>
        )}
        {accessState === 'blocked-permission' && (
          <>
            <div className="font-medium">Sem Permissão</div>
            <div>Permissão: {item.permission}</div>
            <div>Seu role: {currentRole}</div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Wrapper que gere o estado expandido dos itens do menu.
 */
function SidebarItemRenderer({ item, level }: { item: MenuItem; level: number }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(
    // Expandir automaticamente se algum filho estiver ativo
    item.children?.some(child => 
      child.href === pathname || 
      (child.children?.some(grandchild => grandchild.href === pathname))
    ) || false
  );
  
  const isActive = item.href === pathname;
  
  return (
    <SidebarItem
      item={item}
      isActive={isActive}
      level={level}
      onToggle={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    />
  );
}

/**
 * Componente principal da Sidebar.
 * Esta sidebar adapta-se inteligentemente às permissões do utilizador,
 * mostrando apenas o que é relevante e comunicando claramente as limitações.
 */
export function Sidebar() {
  const { user, currentPlan, currentRole } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Função para obter o ícone do role
  const getRoleIcon = () => {
    switch (currentRole) {
      case 'owner': return Crown;
      case 'manager': return Shield;
      case 'cashier': return CreditCard;
      default: return User;
    }
  };
  
  // Função para obter a cor do plano
  const getPlanColor = () => {
    switch (currentPlan) {
      case 'base': return 'bg-green-100 text-green-700';
      case 'tsunami': return 'bg-blue-100 text-blue-700';
      case 'smart_pro': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const RoleIcon = getRoleIcon();
  
  return (
    <div className={`
      bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
      transition-all duration-300 flex flex-col h-full
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header da Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.company?.name || 'Sua Empresa'}
              </h2>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor()}`}>
                  {currentPlan?.toUpperCase()}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {currentRole}
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>
      
      {/* Navegação Principal */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItemRenderer key={item.id} item={item} level={0} />
          ))}
        </nav>
      </div>
      
      {/* Footer da Sidebar - Informações do Utilizador */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || 'Utilizador'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.email || 'email@exemplo.com'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}