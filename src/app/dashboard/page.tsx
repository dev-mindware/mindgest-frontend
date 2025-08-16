"use client"
import { useAuth } from "@/hooks/auth";
import { Role } from "@/types";

function OwnerDashboard() {
  return <h1>DASHBOARD DO PROPRIETARIO</h1>;
}

function ManagerDashboard() {
  return <h1>DASHBOARD DO GERENTE</h1>;
}

function SellerDashboard() {
  return <h1>DASHBOARD DO VENDEDOR</h1>;
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
      <h1>Dashboard</h1>
      <RoleDashboard />
    </div>
  );
}
