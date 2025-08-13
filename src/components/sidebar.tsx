/* "use client";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { getSidebarForUser } from "@/constants/permissions";
import { featuresByPlan } from "@/lib/features";

export function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const activeFeatures = featuresByPlan[user.company.plan] || [];
  const menuItems = getSidebarForUser(user.role, user.company.plan, activeFeatures);

  return (
    <aside className="sidebar">
      <ul>
        {menuItems.map(item => (
          <li key={item.path}>
            <Link href={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
 */