"use client";

import Image from "next/image";
import { Card, CardContent, Badge, Icon } from "@/components";
import { formatCurrency, formatDateTime } from "@/utils";
import { GenericTable, Column } from "@/components/common/generic-table";
import { ButtonOnlyAction } from "@/components/common/button-actions/button-only-action";
import { PosCardSkeleton } from "./pos-skeletons";
import { cn } from "@/lib/utils";
import { CashSession } from "@/types/cash-session";
import { useDeleteCashSession } from "@/hooks/entities";
import { EmptyState } from "@/components/common/empty-state";

interface PosCashierListProps {
  viewMode: "grid" | "table";
  data: CashSession[];
  isLoading: boolean;
  total: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  page: number;
  setPage: (page: number) => void;
}

export function PosCashierList({
  viewMode,
  data,
  isLoading,
  total,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  page,
  setPage,
}: PosCashierListProps) {
  const { mutate: deleteSession } = useDeleteCashSession();

  const sessionActions = (item: CashSession) => [
    {
      label: "Visualizar",
      icon: "Eye" as const,
      onClick: () => { }
    },
    {
      label: "Editar",
      icon: "Pencil" as const,
      onClick: () => {
        // Prepare for edit modal if needed
        console.log("Edit session", item);
      }
    },
    {
      label: "Nota de Ajuste",
      icon: "FileText" as const,
      onClick: () => { }
    },
    {
      type: "separator" as const
    },
    {
      label: "Deletar",
      icon: "Trash2" as const,
      variant: "destructive" as const,
      onClick: () => {
        if (confirm("Tem certeza que deseja excluir esta sessão?")) {
          deleteSession(item.id);
        }
      }
    }
  ];

  const columns: Column<CashSession>[] = [
    {
      key: "user",
      header: "Operador",
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
            <p className="font-bold">{item.user?.name || "N/A"}</p>
            <p className="text-xs text-muted-foreground">{item.user?.email || item.userId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "isOpen",
      header: "Status",
      render: (value) => (
        <Badge variant={value ? "success" : "secondary"}>
          <span className={cn("w-1.5 h-1.5 rounded-full mr-2", value ? "bg-green-500" : "bg-muted-foreground")} />
          {value ? "Aberto" : "Fechado"}
        </Badge>
      ),
    },
    {
      key: "openedAt",
      header: "Abertura",
      render: (value) => <span className="text-xs font-medium">{formatDateTime(value)}</span>,
    },
    {
      key: "openingCash",
      header: "Cap. Inicial",
      render: (value) => <span className="font-bold font-mono">{formatCurrency(value)}</span>,
    },
    {
      key: "totalSales",
      header: "Vendas",
      render: (value) => <span className="font-bold text-primary font-mono">{formatCurrency(value)}</span>,
    },
    {
      key: "cashDifference",
      header: "Diferença",
      render: (value) => (
        <span className={cn("font-bold font-mono", value < 0 ? "text-destructive" : value > 0 ? "text-green-500" : "")}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[50px] text-right",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={sessionActions(item)}
        />
      ),
    },
  ];

  if (isLoading) return <PosCardSkeleton />;

  if (data.length === 0) {
    return (
      <EmptyState
        icon="LayoutGrid"
        title="Nenhuma sessão encontrada"
        description="Não há sessões de caixa registradas para os filtros selecionados."
      />
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {data.map((session) => (
          <Card
            key={session.id}
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
                    <h4 className="font-semibold text-base">{session.user?.name || "Operador"}</h4>
                    <Badge variant={session.isOpen ? "success" : "secondary"}>
                      <span className={cn("w-1 h-1 rounded-full mr-1.5", session.isOpen ? "bg-green-500" : "bg-muted-foreground")} />
                      {session.isOpen ? "Aberto" : "Fechado"}
                    </Badge>
                  </div>
                </div>
                <ButtonOnlyAction
                  data={session}
                  actions={sessionActions(session)}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                      Vendas
                    </p>
                    <p className="text-lg tracking-tight font-black">
                      {formatCurrency(session.totalSales).split(",")[0]}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                      Início
                    </p>
                    <p className="text-sm font-medium">
                      {formatDateTime(session.openedAt).split(" ")[1]}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-muted-foreground/5 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      Cap. Inicial
                    </p>
                    <p className="text-xs font-mono">{formatCurrency(session.openingCash)}</p>
                  </div>
                  {session.duration && (
                    <div className="text-right space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Duração
                      </p>
                      <p className="text-xs font-medium">{session.duration}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <GenericTable
      data={data}
      columns={columns}
      page={page}
      total={total}
      totalPages={totalPages}
      setPage={setPage}
      goToNextPage={goToNextPage}
      goToPreviousPage={goToPreviousPage}
    />
  );
}
