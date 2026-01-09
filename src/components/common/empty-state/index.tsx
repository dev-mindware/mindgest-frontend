import { PackageOpen, icons } from "lucide-react";
import { Icon } from "../icon";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon: keyof typeof icons;
}

export function EmptyState({
  title = "Nenhum item adicionado",
  description = "Adicione novos itens para começar.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8 mt-4 text-center border border-border rounded-xl bg-card">
      <Icon name={icon} className="w-12 h-12 mb-4 text-foreground" />
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-foreground">{description}</p>
    </div>
  );
}
