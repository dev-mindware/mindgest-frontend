import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-24 h-24 text-red-500 mx-auto animate-pulse"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.093 3.333 1.737 3.333h14.86c1.644 0 2.593-1.833 1.736-3.333L13.73 3.373a1.75 1.75 0 00-3.46 0L2.697 16.126zM12 15.75h.007"
            />
          </svg>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
            401
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Acesso Não Autorizado
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Parece que você não tem permissão para visualizar esta página.
          Verifique se sua conta tem o plano e as permissões necessárias para acessar este recurso.
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/dashboard" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors">
            Voltar para o Dashboard
          </Link>
          <Link href="/auth/logout" className="px-6 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-md font-medium transition-colors">
            Sair
          </Link>
        </div>
      </div>
    </div>
  );
}