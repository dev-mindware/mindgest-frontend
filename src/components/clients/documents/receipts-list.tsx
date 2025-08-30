"use client";
import { Receipt } from "@/types";
import { DataTable } from "@/components/custom";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui";

const mockReceipts: Receipt[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `REC-${3000 + i}`,
  client: `Client ${i + 1}`,
  amount: 50 + i * 40,
  date: new Date(2025, 6, i + 10).toISOString().split("T")[0],
  method: i % 2 === 0 ? "Cash" : i % 3 === 0 ? "Transfer" : "Card",
}));

export function ReceiptsTable() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    setTimeout(() => setReceipts(mockReceipts), 500);
  }, []);

  const columns: ColumnDef<Receipt>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "client", header: "Cliente" },
      { accessorKey: "date", header: "Data" },
      {
        accessorKey: "method",
        header: "Método de pagamento",
        cell: ({ row }) => {
          const method = row.getValue("method") as Receipt["method"];
          return (
            <Badge
              className={
                method === "Cash"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-blue-100 text-blue-800"
              }
            >
              {method === "Cash" ? "Dinheiro" : "Transferência"}
            </Badge>
          );
        },
      },
      { accessorKey: "amount", header: "Valor " },
    ],
    []
  );

  return (
    <DataTable
      data={receipts}
      columns={columns}
      searchableColumns={["client"]}
      filterableColumns={[{ id: "method", title: "Payment Method" }]}
      emptyState={{
        title: "No receipts found",
        description: "Start by creating a new receipt.",
      }}
      enableSelection={false}
      enableColumnVisibility={false}
    />
  );
}
