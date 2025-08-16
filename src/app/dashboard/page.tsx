"use client"
import { DinamicBreadcrumb, OwnerDashContent } from "@/components";
import { useAuth } from "@/hooks/auth";
import { Role } from "@/types";

function OwnerDashboard() {
  return <div>
    <OwnerDashContent />
  </div>;
}

function ManagerDashboard() {
  return <div>
    <DinamicBreadcrumb subRoute="Dashboard do Gerente" showSeparator={false} />
  </div>;
}

function SellerDashboard() {
  return <div>
    <DinamicBreadcrumb subRoute="Dashboard do Vendedor" showSeparator={false} />
  </div>;
}

const dashboardByRole: Record<Role, React.FC> = {
  "OWNER": OwnerDashboard,
  "MANAGER": ManagerDashboard,
  "SELLER": SellerDashboard,
  "ADMIN": () => <h1>DASHBOARD DO ADMIN</h1>,
  "CASHIER": () => <h1>DASHBOARD DO CAIXA</h1>,
};

export default function DashboardContent() {
  const { user } = useAuth();

  if (!user) return null;

  const RoleDashboard =
    dashboardByRole[user.role] || (() => <p>Sem conteúdo</p>);

  return (
    <div>
      <RoleDashboard />
    </div>
  );
}
