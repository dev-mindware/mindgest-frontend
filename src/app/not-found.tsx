import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <h1 className="text-8xl sm:text-9xl font-extrabold text-primary tracking-tight transition-colors duration-500">
            404
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-primary absolute -top-4 -right-4 animate-bounce"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.621a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">
          Página não encontrada
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Desculpe, a página que você está procurando não existe ou foi movida.
          Por favor, verifique o endereço ou volte para o dashboard.
        </p>

        <div className="flex justify-center mt-6">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-primary hover:bg-primary/80 rounded-md font-medium transition-colors"
          >
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
