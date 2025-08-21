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

  if (!user) return <DashboardSkeleton />;

  const RoleDashboard =
    dashboardByRole[user.role] || (() => <p>Sem conteúdo</p>);

  return (
    <div>
      <RoleDashboard />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      {/* Skeleton da Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-4 flex flex-col justify-between">
        <div>
          {/* Logo e Nome da Empresa */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="size-8 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="h-4 w-32 rounded-md bg-gray-700 animate-pulse"></div>
          </div>
          {/* Itens do Menu */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 rounded-md bg-gray-800 animate-pulse">
                <div className="size-4 rounded-full bg-gray-700"></div>
                <div className="h-4 w-24 rounded-md bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Info do Usuário */}
        <div className="flex items-center space-x-2 border-t border-gray-800 pt-4">
          <div className="size-10 rounded-full bg-gray-700 animate-pulse"></div>
          <div className="flex flex-col space-y-1">
            <div className="h-3 w-28 rounded-md bg-gray-700 animate-pulse"></div>
            <div className="h-3 w-20 rounded-md bg-gray-700 animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Esqueleto do Conteúdo Principal */}
      <main className="flex-1 p-6">
        {/* Título do Dashboard */}
        <div className="h-8 w-64 rounded-md bg-gray-700 mb-8 animate-pulse"></div>

        {/* Cartões de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-5 w-32 rounded-md bg-gray-700 mb-4"></div>
              <div className="h-8 w-48 rounded-md bg-gray-700 mb-2"></div>
              <div className="h-4 w-24 rounded-md bg-gray-700"></div>
            </div>
          ))}
        </div>

        {/* Gráfico de Área */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 w-48 rounded-md bg-gray-700"></div>
            <div className="h-8 w-24 rounded-md bg-gray-700"></div>
          </div>
          <div className="h-64 rounded-md bg-gray-700 mb-4"></div>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="size-3 rounded-full bg-gray-700"></div>
              <div className="h-3 w-16 rounded-md bg-gray-700"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="size-3 rounded-full bg-gray-700"></div>
              <div className="h-3 w-16 rounded-md bg-gray-700"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    // Redireciona se a sessão não for encontrada
    redirect('/auth/login');
  }

  const { user } = session;

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold">Bem-vindo, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Plano: {user.company.plan}</p>
      <p>ID da Empresa: {user.company.id}</p>
    </div>
  );
}
 */