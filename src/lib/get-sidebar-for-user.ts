
import { MenuItem } from "@/constants/menu-items";
import { Role, Plan } from "@/types";

export function getSidebarForUser(
  items: MenuItem[],
  role: Role,
  plan: Plan
): MenuItem[] {
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


/* import { MenuItem } from "@/constants/menu-items";
import { Role, Plan } from "@/types";

export function getSidebarForUser(
  items: MenuItem[],
  userRole: Role,
  userPlan: Plan
) {
  return items
    .filter(
      (item) =>
        (!item.roles || item.roles.includes(userRole)) &&
        (!item.minPlan || userPlan >= item.minPlan)
    )
    .map((item) => ({
      ...item,
      items: item.items?.filter(
        (sub) =>
          (!sub.roles || sub.roles.includes(userRole)) &&
          (!sub.minPlan || userPlan >= sub.minPlan)
      ),
    }));
}
 */