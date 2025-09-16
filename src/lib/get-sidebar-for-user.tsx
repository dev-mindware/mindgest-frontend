import { MenuItem } from "@/constants/menu-items";
import { Role, PlanType } from "@/types";
import { Icon } from "@/components";

export function getSidebarForUser(
  items: MenuItem[],
  role: Role,
  plan?: PlanType
): MenuItem[] {
  if (!plan) {
    return [
      {
        name: "Perfil",
        url: "/client/profile",
        icon: <Icon name="User" />,
        roles: [role],
      },
      {
        name: "Planos",
        url: "/client/plans",
        icon: <Icon name="Wallet" />,
        roles: [role],
      },
      {
        name: "Configurações",
        url: "/client/settings",
        icon: <Icon name="Settings2" />,
        roles: [role],
      },
    ];
  }

  return items
    .filter((item) => {
      const roleOk = !item.roles || item.roles.includes(role);
      const planOk = !item.minPlan || plan >= item.minPlan;

      if (!planOk && item.showUpgrade) return roleOk;

      return roleOk && planOk;
    })
    .map((item) => ({
      ...item,
      items: item.items?.filter((sub) => {
        const roleOk = !sub.roles || sub.roles.includes(role);
        const planOk = !sub.minPlan || plan >= sub.minPlan;
        return roleOk && planOk;
      }),
    }));
}