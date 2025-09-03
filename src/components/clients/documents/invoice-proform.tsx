"use client";
import { Proforma } from "@/types";
import { Badge } from "@/components/ui";
import { DataTable } from "@/components/custom";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

const mockProformas: Proforma[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `PROF-${2000 + i}`,
  client: `Cliente ${i + 1}`,
  estimate: 200 + i * 75,
  validUntil: new Date(2025, 8, i + 5).toISOString().split("T")[0],
  status: i % 2 === 0 ? "Draft" : "Confirmed",
}));

export function ProformasTable() {
  const [proformas, setProformas] = useState<Proforma[]>([]);

  useEffect(() => {
    setTimeout(() => setProformas(mockProformas), 500);
  }, []);

  const columns: ColumnDef<Proforma>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "client", header: "Cliente" },
      { accessorKey: "estimate", header: "Estimado" },
      { accessorKey: "validUntil", header: "Valido até" },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
          const status = row.getValue("status") as Proforma["status"];
          return (
            <Badge
              className={
                status === "Draft"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-blue-100 text-blue-800"
              }
            >
              {status === "Confirmed" ? "Confirmado" : "Rascunho"}
            </Badge>
          );
        },
      },
    ],
    []
  );

  return (
    <DataTable
      data={proformas}
      columns={columns}
      searchableColumns={["client"]}
      filterableColumns={[{ id: "status", title: "Status" }]}
      emptyState={{
        title: "No proformas found",
        description: "Start by creating a new proforma invoice.",
      }}
      enableSelection={false}
      enableColumnVisibility={false}
    />
  );
}
