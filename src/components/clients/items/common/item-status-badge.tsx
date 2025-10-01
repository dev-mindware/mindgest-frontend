import { useMemo } from "react";
import { ItemStatus } from "@/types";
import { Badge } from "@/components/ui";

interface StatusBadgeProps {
  status: ItemStatus;
}

export function ItemStatusBadge({ status }: StatusBadgeProps) {
  const statusStyles = useMemo(() => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "OUT_OF_STOCK":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  }, [status]);

  return (
    <Badge variant="secondary" className={statusStyles}>
      {displayStatusLabel(status)}
    </Badge>
  );
}

export const statusMap: Record<ItemStatus, string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  OUT_OF_STOCK: "Fora de Estoque",
};

export const displayStatusLabel = (status: ItemStatus): string => {
  if (!status) return "----";
  return statusMap[status] || "----";
};
