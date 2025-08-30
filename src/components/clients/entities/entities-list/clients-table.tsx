"use client";
import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/layout/icon";
import { DataTable, DataTableRowActions } from "@/components/custom";

// ✅ Strong typing
export interface Client {
  id: string;
  nome: string;
  email: string;
  categoria: "VIP" | "Regular" | "Comum";
  nif: string;
}

// ✅ Extract mock clients (static, not inside useEffect)
const mockClients: Client[] = Array.from({ length: 30 }).map((_, i) => ({
  id: (i + 1).toString(),
  nome: `Client ${i + 1}`,
  email: `client${i + 1}@mail.com`,
  categoria: i % 3 === 0 ? "VIP" : i % 3 === 1 ? "Regular" : "Comum",
  nif: (100000000 + i).toString(),
}));

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setClients(mockClients);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // ✅ UseMemo for columns (avoid recreating on each render)
  const clientColumns: ColumnDef<Client>[] = useMemo(
    () => [
      {
        accessorKey: "nome",
        header: "Name",
        cell: ({ row }) => (
          <div className="min-w-0 font-medium">
            <div className="truncate">{row.getValue("nome")}</div>
            <div className="text-xs truncate text-muted-foreground md:hidden">
              {row.getValue("email")}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="hidden min-w-0 md:block truncate">
            {row.getValue("email")}
          </div>
        ),
      },
      {
        accessorKey: "categoria",
        header: "Category",
        cell: ({ row }) => {
          const category = row.getValue("categoria") as Client["categoria"];
          return (
            <div className="flex flex-col gap-1">
              <Badge
                className={cn(
                  "w-fit text-xs",
                  category === "VIP" &&
                    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                  category === "Regular" &&
                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                  category === "Comum" &&
                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                )}
              >
                {category}
              </Badge>
              <div className="font-mono text-xs text-muted-foreground lg:hidden">
                NIF: {row.getValue("nif")}
              </div>
            </div>
          );  
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "nif",
        header: "NIF",
        cell: ({ row }) => (
          <div className="hidden font-mono lg:block">
            {row.getValue("nif")}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            actions={[
              {
                label: "View",
                icon: <Icon name="Eye" size={16} />,
                onClick: (row) => console.log("View client:", row.original),
                shortcut: "⌘V",
              },
              {
                label: "Edit",
                icon: <Icon name="Eraser" size={16} />,
                onClick: (row) => console.log("Edit client:", row.original),
                shortcut: "⌘E",
              },
              {
                label: "Delete",
                icon: <Icon name="Trash2" size={16} />,
                onClick: (row) => handleDeleteClient(row.original.id),
                variant: "destructive",
                shortcut: "⌘⌫",
              },
            ]}
          />
        ),
      },
    ],
    []
  );

  const handleDeleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
    console.log("Deleted client:", id);
  };

  return (
    <div className="bg-background">
      <DataTable
        data={clients}
        columns={clientColumns}
        searchableColumns={["nome", "email"]}
        filterableColumns={[
          {
            id: "categoria",
            title: "Category",
          },
        ]}
        isLoading={isLoading}
        emptyState={{
          title: "No clients found",
          description: "Start by creating a new client record.",
        }}
        // ✅ Custom pagination buttons with #9956F6
        /* pagination={{
          className:
            "flex gap-2 mt-4 [&>button]:bg-[#9956F6] [&>button]:text-white [&>button]:rounded-lg [&>button]:px-3 [&>button]:py-1",
        }} */
      />
    </div>
  );
}
