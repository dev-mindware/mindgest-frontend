import { Role } from "@/types";
import { hasPlanAccess, Plan } from "@/lib/features";

export type MenuItem = {
  label: string;
  path: string;
  minPlan?: Plan;
  feature?: string; 
};

type SidebarPermissions = Record<Role, MenuItem[]>;

export const sidebarPermissions: SidebarPermissions = {
  OWNER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Usuários", path: "/owner/users", minPlan: "BASE" },
    { label: "Configurações", path: "/settings" },
  ],
  MANAGER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Estoque", path: "/inventory", minPlan: "BASE" },
    { label: "Relatórios Avançados", path: "/reports", minPlan: "SMART_PRO", feature: "ADVANCED_REPORTS" },
  ],
  SELLER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Pedidos", path: "/orders" },
  ],
  CASHIER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Caixa", path: "/cashier" },
  ],
  ADMIN: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Painel Administrativo", path: "/admin" },
  ],
};

/**
 * Filtra menus com base no plano e nas features
 */
export function getSidebarForUser(
  role: Role,
  plan: Plan,
  activeFeatures: string[] = []
) {
  const menu = sidebarPermissions[role] || [];
  return menu.filter(item => {
    if (item.minPlan && !hasPlanAccess(plan, item.minPlan)) return false;
    if (item.feature && !activeFeatures.includes(item.feature)) return false;
    return true;
  });
}
