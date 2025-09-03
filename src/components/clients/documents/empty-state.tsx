import { PackageOpen } from "lucide-react";

export function EmptyState() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900">
      <PackageOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Nenhum item adicionado
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Adicione novos itens para começar.
      </p>
    </div>
  );
}
