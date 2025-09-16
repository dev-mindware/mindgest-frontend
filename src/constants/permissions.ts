import { PlanType, Role } from "@/types";
import { hasPlanAccess } from "@/lib/features";

export type MenuItem = {
  label: string;
  path: string;
  minPlan?: PlanType;
  feature?: string;
};

type SidebarPermissions = Record<Role, MenuItem[]>;

export const sidebarPermissions: SidebarPermissions = {
  OWNER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Usuários", path: "/owner/users", minPlan: "Base" },
    { label: "Configurações", path: "/settings" },
  ],
  MANAGER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Estoque", path: "/inventory", minPlan: "Base" },
    {
      label: "Relatórios Avançados",
      path: "/reports",
      minPlan: "Smart Pro",
      feature: "ADVANCED_REPORTS",
    },
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
  plan: PlanType,
  activeFeatures: string[] = []
) {
  const menu = sidebarPermissions[role] || [];
  return menu.filter((item) => {
    if (item.minPlan && !hasPlanAccess(plan, item.minPlan)) return false;
    if (item.feature && !activeFeatures.includes(item.feature)) return false;
    return true;
  });
}
