"use client";

import { Icon } from "@/components";
import { currentStoreStore, useModal } from "@/stores";
import { cn } from "@/lib/utils";
import {
  PosCloseSessionModal,
  PosOpeningCashierModal,
  PosRegisterExpenseModal,
  PosRequestOpeningModal,
} from "../../modal";
import { PosOpeningModal } from "@/components/client/management/pos/modal/pos-opening-modal";
import { useAuth } from "@/hooks/auth/use-auth";
import { formatCurrency, formatDateTime } from "@/utils";
import { CashSession } from "@/types/cash-session";
import { useQueryClient } from "@tanstack/react-query";

interface PosGeneralSettingsProps {
  currentSession?: CashSession;
}

export function PosGeneralSettings({ currentSession }: PosGeneralSettingsProps) {
  const { openModal } = useModal();
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();
  const queryClient = useQueryClient();
  const isOpen = !!currentSession?.isOpen;
  const isManagement =
    user?.role === "ADMIN" ||
    user?.role === "OWNER" ||
    user?.role === "MANAGER";
  const currentPlan = user?.company?.subscription?.plan?.name;
  const shouldHideOpeningRequest =
    user?.role === "CASHIER" && currentPlan === "Smart";

  const actionCards = [
    {
      title: "Solicitar",
      subtitle: "Abertura de caixa",
      description: "Pedir autorização para iniciar",
      icon: "ClipboardList",
      tourKey: "pos-settings-request-opening",
      variant: "action" as const,
      onClick: () => openModal("pos-request-opening-modal"),
    },
    {
      title: isOpen ? "Sessão" : "Abrir",
      subtitle: isOpen ? "Caixa aberto" : "Iniciar caixa",
      description: isOpen ? "Turno em andamento" : "Abrir uma nova sessão",
      icon: isOpen ? "Check" : "Play",
      tourKey: "pos-settings-open-session",
      variant: isOpen ? ("default" as const) : ("action" as const),
      onClick: !isOpen
        ? () =>
            openModal(
              isManagement ? "opening-cashier" : "opening-cashier-session",
            )
        : undefined,
    },
    {
      title: "Fechar",
      subtitle: "Encerrar sessão",
      description: "Finalizar o turno do caixa",
      icon: "Power",
      tourKey: "pos-settings-close-session",
      variant: isOpen ? ("action" as const) : ("default" as const),
      colors: "destructive" as const,
      onClick: isOpen ? () => openModal("pos-close-session-modal") : undefined,
      disabled: !isOpen,
    },
    {
      title: "Registar",
      subtitle: "Nova despesa",
      description: "Registar saída manual",
      icon: "Minus",
      tourKey: "pos-settings-register-expense",
      variant: isOpen ? ("action" as const) : ("default" as const),
      colors: "destructive" as const,
      onClick: isOpen ? () => openModal("pos-register-expense-modal") : undefined,
      disabled: !isOpen,
    },
  ].filter((card) => {
    if (shouldHideOpeningRequest && card.tourKey === "pos-settings-request-opening") {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-12" data-tour="pos-settings-general">
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        data-tour="pos-settings-actions"
      >
        {actionCards.map((card) => (
          <button
            key={card.tourKey}
            type="button"
            data-tour={card.tourKey}
            onClick={card.onClick}
            disabled={card.disabled}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl transition-all active:scale-95 text-center gap-2 border shadow-sm",
              card.disabled
                ? "opacity-40 grayscale pointer-events-none bg-muted/20 border-border/50"
                : card.colors === "destructive"
                  ? "bg-destructive/5 hover:bg-destructive/10 border-destructive/10 text-destructive"
                  : "bg-background hover:bg-muted/30 border-border/50 text-foreground",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-1",
                card.colors === "destructive"
                  ? "bg-destructive/10"
                  : "bg-primary/10",
              )}
            >
              <Icon
                name={card.icon as any}
                size={20}
                className={
                  card.colors === "destructive"
                    ? "text-destructive"
                    : "text-primary"
                }
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold leading-tight uppercase tracking-wide opacity-70">
                {card.title}
              </p>
              <p className="text-sm font-bold truncate max-w-[130px]">
                {card.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>

      {currentSession && (
        <div className="space-y-4" data-tour="pos-settings-session-details">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] px-1">
            Detalhes da sessão
          </p>

          <div
            className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4"
            data-tour="pos-settings-session-metrics"
          >
            {[
              {
                label: "Total em vendas",
                value: formatCurrency(currentSession.totalSales || 0),
                icon: "TrendingUp",
                color: "text-primary-500",
                bg: "bg-primary-500/10",
                valueClass: "text-primary-600",
              },
              {
                label: "Tempo decorrido",
                value: currentSession.duration || "00:00:00",
                icon: "Timer",
                color: "text-primary-500",
                bg: "bg-primary-500/10",
              },
              {
                label: "Fundo de maneio",
                value: formatCurrency(currentSession.openingCash),
                icon: "Wallet",
                color: "text-primary-500",
                bg: "bg-primary-500/10",
              },
              {
                label: "Responsável",
                value: currentSession.authorizedById || "-",
                icon: "User",
                color: "text-primary-500",
                bg: "bg-primary-500/10",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm space-y-3"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    metric.bg,
                  )}
                >
                  <Icon name={metric.icon as any} size={20} className={metric.color} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {metric.label}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-black font-outfit truncate",
                      metric.valueClass,
                    )}
                  >
                    {metric.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="md:hidden bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/30 shadow-sm"
            data-tour="pos-settings-session-metrics"
          >
            <div className="flex items-center justify-between p-4 bg-muted/5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isOpen ? "bg-green-500/10" : "bg-red-500/10",
                  )}
                >
                  <Icon
                    name={isOpen ? "CircleDot" : "Circle"}
                    size={16}
                    className={isOpen ? "text-green-600" : "text-red-500"}
                  />
                </div>
                <p className="text-sm font-medium">Estado do caixa</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isOpen ? "bg-green-500 animate-pulse" : "bg-red-500",
                  )}
                />
                <span className="text-sm font-bold">
                  {isOpen ? "Em operação" : "Finalizada"}
                </span>
              </div>
            </div>

            {[
              {
                label: "Tempo decorrido",
                value: currentSession.duration || "00:00:00",
                icon: "Timer",
                iconColor: "text-primary-500",
                iconBg: "bg-primary-500/10",
              },
              {
                label: "Total em vendas",
                value: formatCurrency(currentSession.totalSales || 0),
                icon: "TrendingUp",
                iconColor: "text-emerald-500",
                iconBg: "bg-emerald-500/10",
                valueClass: "text-emerald-600",
              },
              {
                label: "Fundo de maneio",
                value: formatCurrency(currentSession.openingCash),
                icon: "Wallet",
                iconColor: "text-orange-500",
                iconBg: "bg-orange-500/10",
              },
              {
                label: "Abertura",
                value: formatDateTime(currentSession.openedAt),
                icon: "Calendar",
                iconColor: "text-indigo-500",
                iconBg: "bg-indigo-500/10",
              },
              {
                label: "Responsável",
                value: currentSession.authorizedById || "-",
                icon: "User",
                iconColor: "text-gray-500",
                iconBg: "bg-gray-500/10",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between p-4 active:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      metric.iconBg,
                    )}
                  >
                    <Icon
                      name={metric.icon as any}
                      size={16}
                      className={metric.iconColor}
                    />
                  </div>
                  <p className="text-sm font-medium">{metric.label}</p>
                </div>
                <span className={cn("text-sm font-bold", metric.valueClass)}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {currentSession.notes && (
            <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border flex gap-3">
              <Icon
                name="MessageSquare"
                size={16}
                className="text-muted-foreground mt-0.5"
              />
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Observações
                </p>
                <p className="text-xs italic text-muted-foreground leading-relaxed">
                  {currentSession.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <PosOpeningModal />
      <PosOpeningCashierModal
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: ["current-cash-session", currentStore?.id],
          });
        }}
      />
      <PosRequestOpeningModal />
      <PosRegisterExpenseModal currentSession={currentSession} />
      <PosCloseSessionModal currentSession={currentSession} />
    </div>
  );
}
