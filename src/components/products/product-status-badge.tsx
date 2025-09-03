import { useMemo } from "react";
import { Badge } from "../ui";
import { ProductStatus } from "@/types";

interface StatusBadgeProps {
  status: ProductStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles = useMemo(() => {
    switch (status) {
      case "Disponível":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  }, [status]);

  return (
    <Badge variant="secondary" className={statusStyles}>
      {status}
    </Badge>
  );
};