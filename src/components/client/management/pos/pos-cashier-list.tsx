"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Card, CardContent, Badge, Progress } from "@/components";
import { formatCurrency } from "@/utils";
import { GenericTable, Column } from "@/components/common/generic-table";
import { ButtonOnlyAction } from "@/components/common/button-actions/button-only-action";
import { PosCardSkeleton } from "./pos-skeletons";
import { Cashier } from "./data";
import { useModal } from "@/stores";
import { useCurrentCashierStore } from "@/stores/pos/current-cashier-store";

interface PosCashierListProps {
  cashiers: Cashier[];
  isLoading: boolean;
  viewMode: "grid" | "table";
}

export function PosCashierList({
  cashiers,
  isLoading,
  viewMode,
}: PosCashierListProps) {
  const { openModal } = useModal();
  const { setCurrentCashier } = useCurrentCashierStore();

  const cashierActions = useMemo(
    () => [
      {
        label: "Editar",
        icon: "Pencil" as const,
        onClick: (data: Cashier) => {
          setCurrentCashier(data);
          openModal("opening-cashier");
        },
      },
      {
        label: "Fechar Caixa",
        icon: "CircleX" as const,
        onClick: (data: Cashier) => console.log("Fechar", data),
      },
      {
        type: "separator" as const,
      },
      {
        label: "Deletar",
        icon: "Trash2" as const,
        variant: "destructive" as const,
        onClick: (data: Cashier) => {
          setCurrentCashier(data);
          openModal("delete-cashier");
        },
      },
    ],
    []
  );

  const columns: Column<Cashier>[] = [
    {
      key: "name",
      header: "Caixa",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted/30 border border-muted-foreground/5 shrink-0">
            <Image
              src="/pos-computer-icon.png"
              alt="POS"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <p className="font-bold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.user}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <Badge variant="success">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
          {value}
        </Badge>
      ),
    },
    {
      key: "totalSold",
      header: "Vendas",
      render: (value) => (
        <span className="font-bold">{formatCurrency(value)}</span>
      ),
    },
    {
      key: "activityTime",
      header: "Atividade",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "progress",
      header: "Progresso",
      render: (value) => (
        <div className="flex items-center gap-3 min-w-[120px]">
          <Progress value={value} className="h-1.5" />
          <span className="text-[10px] font-bold text-primary">{value}%</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[50px] text-right",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            { label: "Ação", onClick: () => {} },
            /* cashierActions */
          ]}
        />
      ),
    },
  ];

  if (isLoading) return <PosCardSkeleton />;

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cashiers.map((cashier) => (
          <Card
            key={cashier.id}
            className="group hover:border-primary/40 transition-all duration-300 shadow-none border-muted-foreground/10 overflow-hidden"
          >
            <CardContent className="p-5 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/pos-computer-icon.png"
                      alt="POS"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-base">{cashier.name}</h4>
                    <Badge variant="success">
                      <span className="w-1 h-1 rounded-full bg-green-500 mr-1.5" />
                      {cashier.status}
                    </Badge>
                  </div>
                </div>
                <ButtonOnlyAction
                  data={cashier}
                  actions={[{ label: "ação 2", onClick: () => {} }]}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                    Responsável
                  </p>
                  <p className="text-sm truncate">{cashier.user}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                      Total
                    </p>
                    <p className="text-lg tracking-tight">
                      {formatCurrency(cashier.totalSold).split(",")[0]}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                      Tempo
                    </p>
                    <p className="text-lg tracking-tight">
                      {cashier.activityTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    Progresso
                  </p>
                  <span className="text-xs text-primary">
                    {cashier.progress}%
                  </span>
                </div>
                <Progress
                  value={cashier.progress}
                  className="h-1.5 bg-muted rounded-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <GenericTable
      data={cashiers}
      columns={columns}
      page={1}
      total={cashiers.length}
      totalPages={1}
      setPage={() => {}}
      goToNextPage={() => {}}
      goToPreviousPage={() => {}}
    />
  );
}
