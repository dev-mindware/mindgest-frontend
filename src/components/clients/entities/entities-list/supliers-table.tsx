"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/icon";
import { DataTable, DataTableRowActions } from "@/components/custom";

interface Supplier {
  id: string;
  nome: string;
  tipoFornecedor: "Empresa" | "Particular";
  nif: string;
  telefone: string;
}

export function SuppliersTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulando dados de fornecedores
    const mockSuppliers: Supplier[] = [
      {
        id: "1",
        nome: "TechnoLda",
        tipoFornecedor: "Empresa",
        nif: "500123456",
        telefone: "+244 923 456 789"
      },
      {
        id: "2",
        nome: "Carlos Mendes",
        tipoFornecedor: "Particular",
        nif: "123456789",
        telefone: "+244 912 345 678"
      },
      {
        id: "3",
        nome: "Distribuidora Angola",
        tipoFornecedor: "Empresa",
        nif: "500987654",
        telefone: "+244 924 567 890"
      },
      {
        id: "4",
        nome: "Isabel Rodrigues",
        tipoFornecedor: "Particular",
        nif: "987654321",
        telefone: "+244 913 456 789"
      },
      {
        id: "5",
        nome: "Comércio & Cia",
        tipoFornecedor: "Empresa",
        nif: "500456789",
        telefone: "+244 925 678 901"
      }
    ];

    setIsLoading(true);
    setTimeout(() => {
      setSuppliers(mockSuppliers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const supplierColumns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nome")}</div>
      ),
      size: 200,
    },
    {
      accessorKey: "tipoFornecedor",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.getValue("tipoFornecedor") as string;
        return (
          <Badge
            className={cn(
              tipo === "Empresa" &&
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
              tipo === "Particular" &&
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            )}
          >
            {tipo}
          </Badge>
        );
      },
      size: 120,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "nif",
      header: "NIF",
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue("nif")}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue("telefone")}</div>
      ),
      size: 150,
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
              onClick: (row) => console.log("Ver fornecedor:", row.original),
              shortcut: "⌘V",
            },
            {
              label: "Editar",
              icon: <Icon name="Eraser" size={16} />,
              onClick: (row) => console.log("Editar fornecedor:", row.original),
              shortcut: "⌘E",
            },
            {
              label: "Contactar",
              icon: <Icon name="Phone" size={16} />,
              onClick: (row) => console.log("Contactar fornecedor:", row.original),
              shortcut: "⌘C",
            },
            {
              label: "Excluir",
              icon: <Icon name="Trash2" size={16} />,
              onClick: (row) => console.log("Excluir fornecedor:", row.original),
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
  const handleDeleteSuppliers = (selectedRows: any[]) => {
    const updatedSuppliers = suppliers.filter(
      (supplier) => !selectedRows.some((row) => row.original.id === supplier.id)
    );
    setSuppliers(updatedSuppliers);
    console.log(
      "Fornecedores excluídos:",
      selectedRows.map((row) => row.original)
    );
  };

  return (
    <div className="bg-background">
      <DataTable
        data={suppliers}
        columns={supplierColumns}
        searchableColumns={["nome"]}
        filterableColumns={[
          {
            id: "tipoFornecedor",
            title: "Tipo de Fornecedor",
          },
        ]}
        onDelete={handleDeleteSuppliers}
        isLoading={isLoading}
        emptyState={{
          title: "Nenhum fornecedor encontrado",
          description: "Comece criando um novo registro de fornecedor.",
        }}
      />
    </div>
  );
}