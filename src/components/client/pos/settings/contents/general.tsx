"use client";
import { Card, CardContent, Icon, DynamicMetricCard } from "@/components";
import { currentStoreStore, useModal } from "@/stores";
import { cn } from "@/lib/utils";
import {
    PosOpeningCashierModal,
    PosRequestOpeningModal,
    PosRegisterExpenseModal,
    PosCloseSessionModal
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
    const isManagement = user?.role === "ADMIN" || user?.role === "OWNER" || user?.role === "MANAGER";

    const actionCards = [
        {
            title: "Solicitar",
            subtitle: "Abertura de Caixa",
            description: "Peça autorização para iniciar",
            icon: "ClipboardList",
            variant: "action" as const,
            onClick: () => openModal("pos-request-opening-modal"),
        },
        {
            title: isOpen ? "Sessão" : "Abrir",
            subtitle: isOpen ? "Caixa Aberto" : "Iniciar Caixa",
            description: isOpen ? "Turno em andamento" : "Clique para abrir o caixa",
            icon: isOpen ? "Check" : "Play",
            variant: isOpen ? ("default" as const) : ("action" as const),
            onClick: !isOpen
                ? () => openModal(isManagement ? "opening-cashier" : "opening-cashier-session")
                : undefined,
        },
        {
            title: "Fechar",
            subtitle: "Encerrar Sessão",
            description: "Finalize as vendas do dia",
            icon: "Power",
            variant: isOpen ? ("action" as const) : ("default" as const),
            colors: "destructive" as const,
            onClick: isOpen ? () => openModal("pos-close-session-modal") : undefined,
            disabled: !isOpen,
        },
        {
            title: "Registar",
            subtitle: "Nova Despesa",
            description: "Saída manual de valores",
            icon: "Minus",
            variant: isOpen ? ("action" as const) : ("default" as const),
            colors: "destructive" as const,
            onClick: isOpen ? () => openModal("pos-register-expense-modal") : undefined,
            disabled: !isOpen,
        },
    ];

    const sessionMetrics = currentSession ? [
        {
            label: "Status Atual",
            value: (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "flex h-2 w-2 rounded-full",
                        isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                    )} />
                    <span className="font-outfit font-semibold">{isOpen ? "Em Operação" : "Finalizada"}</span>
                </div>
            )
        },
        {
            label: "Tempo Decorrido",
            value: (
                <div className="flex items-center gap-2">
                    <Icon name="Timer" className="h-3.5 w-3.5 text-primary" />
                    <p className="font-mono font-bold text-primary">{currentSession.duration || "00:00:00"}</p>
                </div>
            )
        },
        {
            label: "Abertura",
            value: formatDateTime(currentSession.openedAt)
        },
        {
            label: "Vendas (Total)",
            className: "text-right md:text-left",
            value: (
                <p className="text-xl font-outfit font-black text-primary leading-tight">
                    {formatCurrency(currentSession.totalSales || 0)}
                </p>
            )
        },
        {
            label: "Fundo de Caixa",
            value: <span className="text-lg">{formatCurrency(currentSession.openingCash)}</span>
        },
        {
            label: "Tipo Pagamento",
            value: currentSession.fundType || "-"
        },
        {
            label: "Responsável",
            value: <span className="truncate block" title={currentSession.authorizedById}>{currentSession.authorizedById || "-"}</span>
        }
    ] : [];

    return (
        <div className="space-y-8 pb-12">
            {/* Action Group - iOS Style Shortcut Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {actionCards.map((card, index) => (
                    <button
                        key={index}
                        onClick={card.onClick}
                        disabled={(card as any).disabled}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl transition-all active:scale-95 text-center gap-2 border shadow-sm",
                            (card as any).disabled 
                                ? "opacity-40 grayscale pointer-events-none bg-muted/20 border-border/50" 
                                : card.colors === "destructive"
                                    ? "bg-destructive/5 hover:bg-destructive/10 border-destructive/10 text-destructive"
                                    : "bg-background hover:bg-muted/30 border-border/50 text-foreground"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center mb-1",
                            card.colors === "destructive" ? "bg-destructive/10" : "bg-primary/10"
                        )}>
                            <Icon name={card.icon as any} size={20} className={card.colors === "destructive" ? "text-destructive" : "text-primary"} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold leading-tight uppercase tracking-wide opacity-70">{card.title}</p>
                            <p className="text-sm font-bold truncate max-w-[130px]">{card.subtitle}</p>
                        </div>
                    </button>
                ))}
            </div>

            {currentSession && (
                <div className="space-y-4">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] px-1">Detalhes da Sessão</p>
                    
                    {/* Desktop View: Minimalist Metric Cards */}
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total em Vendas", value: formatCurrency(currentSession.totalSales || 0), icon: "TrendingUp", color: "text-primary-500", bg: "bg-primary-500/10", valueClass: "text-primary-600" },
                            { label: "Tempo decorrido", value: currentSession.duration || "00:00:00", icon: "Timer", color: "text-primary-500", bg: "bg-primary-500/10" },
                            { label: "Fundo de Manejo", value: formatCurrency(currentSession.openingCash), icon: "Wallet", color: "text-primary-500", bg: "bg-primary-500/10" },
                            { label: "Responsável", value: currentSession.authorizedById || "-", icon: "User", color: "text-primary-500", bg: "bg-primary-500/10" },
                        ].map((m, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm space-y-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", m.bg)}>
                                    <Icon name={m.icon as any} size={20} className={m.color} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                                    <p className={cn("text-lg font-black font-outfit truncate", m.valueClass)}>{m.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile View: iOS Inset Grouped List */}
                    <div className="md:hidden bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/30 shadow-sm">
                        {/* Status Item */}
                        <div className="flex items-center justify-between p-4 bg-muted/5">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isOpen ? "bg-green-500/10" : "bg-red-500/10")}>
                                    <Icon name={isOpen ? "CircleDot" : "Circle"} size={16} className={isOpen ? "text-green-600" : "text-red-500"} />
                                </div>
                                <p className="text-sm font-medium">Estado do Caixa</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn("h-2 w-2 rounded-full", isOpen ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                                <span className="text-sm font-bold">{isOpen ? "Em Operação" : "Finalizada"}</span>
                            </div>
                        </div>

                        {[
                            { label: "Tempo decorrido", value: currentSession.duration || "00:00:00", icon: "Timer", iconColor: "text-primary-500", iconBg: "bg-primary-500/10" },
                            { label: "Total em Vendas", value: formatCurrency(currentSession.totalSales || 0), icon: "TrendingUp", iconColor: "text-emerald-500", iconBg: "bg-emerald-500/10", valueClass: "text-emerald-600" },
                            { label: "Fundo de Maneio", value: formatCurrency(currentSession.openingCash), icon: "Wallet", iconColor: "text-orange-500", iconBg: "bg-orange-500/10" },
                            { label: "Abertura", value: formatDateTime(currentSession.openedAt), icon: "Calendar", iconColor: "text-indigo-500", iconBg: "bg-indigo-500/10" },
                            { label: "Responsável", value: currentSession.authorizedById || "-", icon: "User", iconColor: "text-gray-500", iconBg: "bg-gray-500/10" },
                        ].map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-4 active:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", m.iconBg)}>
                                        <Icon name={m.icon as any} size={16} className={m.iconColor} />
                                    </div>
                                    <p className="text-sm font-medium">{m.label}</p>
                                </div>
                                <span className={cn("text-sm font-bold", m.valueClass)}>{m.value}</span>
                            </div>
                        ))}
                    </div>
                    
                    {currentSession.notes && (
                        <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border flex gap-3">
                            <Icon name="MessageSquare" size={16} className="text-muted-foreground mt-0.5" />
                            <div className="space-y-0.5">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Observações</p>
                                <p className="text-xs italic text-muted-foreground leading-relaxed">{currentSession.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <PosOpeningModal />
            <PosOpeningCashierModal onSuccess={() => {
                queryClient.invalidateQueries({
                    queryKey: ["current-cash-session", currentStore?.id]
                });
            }} />
            <PosRequestOpeningModal />
            <PosRegisterExpenseModal currentSession={currentSession} />
            <PosCloseSessionModal currentSession={currentSession} />
        </div>
    );
}

function MetricItem({ label, value, className }: { label: string, value: React.ReactNode, className?: string }) {
    return (
        <div className={cn("space-y-1", className)}>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className="font-semibold">{value}</div>
        </div>
    );
}
