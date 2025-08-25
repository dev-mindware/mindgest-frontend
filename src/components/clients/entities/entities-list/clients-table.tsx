"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/layout/icon";
import { DataTable, DataTableRowActions } from "@/components/custom";

interface Client {
  id: string;
  nome: string;
  email: string;
  categoria: "VIP" | "Regular" | "Comum";
  nif: string;
}

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulando dados de clientes
    const mockClients: Client[] = [
      {
        id: "1",
        nome: "Ana Silva",
        email: "ana.silva@email.com",
        categoria: "VIP",
        nif: "123456789"
      },
      {
        id: "2",
        nome: "João Santos",
        email: "joao.santos@email.com",
        categoria: "Regular",
        nif: "987654321"
      },
      {
        id: "3",
        nome: "Maria Costa",
        email: "maria.costa@email.com",
        categoria: "Comum",
        nif: "456789123"
      },
      {
        id: "4",
        nome: "Pedro Oliveira",
        email: "pedro.oliveira@email.com",
        categoria: "VIP",
        nif: "789123456"
      },
      {
        id: "5",
        nome: "Sofia Ferreira",
        email: "sofia.ferreira@email.com",
        categoria: "Regular",
        nif: "321654987"
      }
    ];

    setIsLoading(true);
    setTimeout(() => {
      setClients(mockClients);
      setIsLoading(false);
    }, 1000);
  }, []);

  const clientColumns: ColumnDef<Client>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className="min-w-0 font-medium">
          <div className="truncate">{row.getValue("nome")}</div>
          <div className="text-xs truncate text-muted-foreground md:hidden">
            {row.getValue("email")}
          </div>
        </div>
      ),
      minSize: 120,
      size: 180,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="hidden min-w-0 md:block">
          <div className="truncate">{row.getValue("email")}</div>
        </div>
      ),
      size: 220,
    },
    {
      accessorKey: "categoria",
      header: "Categoria",
      cell: ({ row }) => {
        const categoria = row.getValue("categoria") as string;
        return (
          <div className="flex flex-col gap-1">
            <Badge
            
              className={cn(
                "w-fit text-xs",
                categoria === "VIP" &&
                  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                categoria === "Regular" &&
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                categoria === "Comum" &&
                  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              )}
            >
              {categoria}
            </Badge>
            <div className="font-mono text-xs text-muted-foreground lg:hidden">
              NIF: {row.getValue("nif")}
            </div>
          </div>
        );
      },
      minSize: 80,
      size: 120,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "nif",
      header: "NIF",
      cell: ({ row }) => (
        <div className="hidden font-mono lg:block">
          {row.getValue("nif")}
        </div>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: "Visualizar",
              icon: <Icon name="Eye" size={16} />,
              onClick: (row) => console.log("Ver cliente:", row.original),
              shortcut: "⌘V",
            },
            {
              label: "Editar",
              icon: <Icon name="Eraser" size={16} />,
              onClick: (row) => console.log("Editar cliente:", row.original),
              shortcut: "⌘E",
            },
            {
              label: "Excluir",
              icon: <Icon name="Trash2" size={16} />,
              onClick: (row) => console.log("Excluir cliente:", row.original),
              variant: "destructive",
              shortcut: "⌘⌫",
            },
          ]}
        />
      ),
      size: 60,
      minSize: 60,
      enableHiding: false,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteClients = (selectedRows: any[]) => {
    const updatedClients = clients.filter(
      (client) => !selectedRows.some((row) => row.original.id === client.id)
    );
    setClients(updatedClients);
    console.log(
      "Clientes excluídos:",
      selectedRows.map((row) => row.original)
    );
  };

  return (
    <div className="bg-background">
      <DataTable
        data={clients}
        columns={clientColumns}
        searchableColumns={["nome"]}
        filterableColumns={[
          {
            id: "categoria",
            title: "Categoria",
          },
        ]}
        onDelete={handleDeleteClients}
        isLoading={isLoading}
        emptyState={{
          title: "Nenhum cliente encontrado",
          description: "Comece criando uma nova conta de cliente.",
        }}
      />
    </div>
  );
}