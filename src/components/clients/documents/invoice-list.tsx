"use client";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/custom";
import { Invoice, InvoiceStatus } from "@/types";

const mockInvoices: Invoice[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  client: `Client ${i + 1}`,
  total: 100 + i * 50,
  status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Canceled",
  date: new Date(2025, 7, i + 1).toISOString().split("T")[0],
}));

export function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setTimeout(() => setInvoices(mockInvoices), 500);
  }, []);

  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      { accessorKey: "client", header: "Cliente" },
      { accessorKey: "date", header: "Data" },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
          const status = row.getValue("status") as InvoiceStatus;
          return (
            <Badge
              className={
                status === "Paid"
                  ? "bg-green-100 text-green-800"
                  : status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {status === "Paid"
                ? "Pago"
                : status === "Pending"
                ? "Pendente"
                : "Cancelado"}
            </Badge>
          );
        },
      },
      { accessorKey: "total", header: "Total" },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <button onClick={() => alert(row.original.id)}>ver </button>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      data={invoices}
      columns={columns}
      searchableColumns={["client"]}
      filterableColumns={[{ id: "status", title: "Status" }]}
      enableSelection={false}
      enableColumnVisibility={false}
      emptyState={{
        title: "No invoices found",
        description: "Start by creating a new invoice.",
      }}
    />
  );
}
