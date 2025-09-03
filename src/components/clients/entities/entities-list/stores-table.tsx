"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/icon";
import { DataTable, DataTableRowActions } from "@/components/custom";

interface Store {
  id: string;
  nome: string;
  gerente: string;
  status: "Ativa" | "Inativa" | "Manutenção";
  endereco: string;
}

export function StoresTable() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mockStores: Store[] = [
      {
        id: "1",
        nome: "Loja Central",
        gerente: "António Pereira",
        status: "Ativa",
        endereco: "Rua da Independência, 123, Luanda",
      },
      {
        id: "2",
        nome: "Loja Talatona",
        gerente: "Maria Fernanda",
        status: "Ativa",
        endereco: "Condomínio Jardim de Rosas, Talatona",
      },
      {
        id: "3",
        nome: "Loja Viana",
        gerente: "João Manuel",
        status: "Manutenção",
        endereco: "Estrada de Viana, Km 9, Viana",
      },
      {
        id: "4",
        nome: "Loja Cacuaco",
        gerente: "Esperança Silva",
        status: "Ativa",
        endereco: "Rua Principal, Cacuaco",
      },
      {
        id: "5",
        nome: "Loja Belas",
        gerente: "Fernando Costa",
        status: "Inativa",
        endereco: "Urbanização Nova Vida, Belas",
      },
    ];

    setIsLoading(true);
    setTimeout(() => {
      setStores(mockStores);
      setIsLoading(false);
    }, 1000);
  }, []);

  const storeColumns: ColumnDef<Store>[] = [
    {
      accessorKey: "nome",
      header: "Nome da Loja",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nome")}</div>
      ),
      size: 150,
    },
    {
      accessorKey: "gerente",
      header: "Gerente",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("gerente")}</div>
      ),
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            className={cn(
              status === "Ativa" &&
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
              status === "Inativa" &&
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
              status === "Manutenção" &&
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            )}
          >
            {status}
          </Badge>
        );
      },
      size: 120,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "endereco",
      header: "Endereço",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[250px] truncate">
          {row.getValue("endereco")}
        </div>
      ),
      size: 250,
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
              onClick: (row) => console.log("Ver loja:", row.original),
              shortcut: "⌘V",
            },
            {
              label: "Editar",
              icon: <Icon name="Eraser" size={16} />,
              onClick: (row) => console.log("Editar loja:", row.original),
              shortcut: "⌘E",
            },
            {
              label: "Localização",
              icon: <Icon name="MapPin" size={16} />,
              onClick: (row) => console.log("Ver localização:", row.original),
              shortcut: "⌘L",
            },
            {
              label: "Relatórios",
              icon: <Icon name="ChartBar" size={16} />,
              onClick: (row) => console.log("Ver relatórios:", row.original),
              shortcut: "⌘R",
            },
            {
              label: "Excluir",
              icon: <Icon name="Trash2" size={16} />,
              onClick: (row) => console.log("Excluir loja:", row.original),
              variant: "destructive",
              shortcut: "⌘⌫",
            },
          ]}
        />
      ),
      size: 60,
      enableHiding: false,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteStores = (selectedRows: any[]) => {
    const updatedStores = stores.filter(
      (store) => !selectedRows.some((row) => row.original.id === store.id)
    );
    setStores(updatedStores);
    console.log(
      "Lojas excluídas:",
      selectedRows.map((row) => row.original)
    );
  };

  return (
    <div className="bg-background">
      <DataTable
        data={stores}
        columns={storeColumns}
        searchableColumns={["nome", "gerente"]}
        filterableColumns={[
          {
            id: "status",
            title: "Status",
          },
        ]}
        onDelete={handleDeleteStores}
        isLoading={isLoading}
        emptyState={{
          title: "Nenhuma loja encontrada",
          description: "Comece criando um novo registro de loja.",
        }}
      />
    </div>
  );
}
