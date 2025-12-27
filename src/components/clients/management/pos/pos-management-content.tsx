"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Input,
    Button,
    Icon,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components";
import { formatCurrency } from "@/utils";
import { cn } from "@/lib/utils";
import { useModal, useCurrentCashierStore } from "@/stores";
import { DynamicMetricCard, DynamicMetricCardSkeleton } from "@/components/shared";
import { PosRequestsModal, PosOpeningModal, PosDeleteModal } from "./modal";
import { PosCashierList } from "./pos-cashier-list";
import { summaryCards, cashiers } from "./data";

export function PosManagementContent() {
    const { openModal } = useModal();
    const { setCurrentCashier } = useCurrentCashierStore();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="p-6 space-y-8">
            <div className="space-y-8">
                <section className="space-y-6">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <DynamicMetricCardSkeleton key={idx} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {summaryCards.map((card, idx) => (
                                <DynamicMetricCard
                                    key={idx}
                                    variant={card.type}
                                    icon={card.icon}
                                    title={
                                        card.type === "default"
                                            ? formatCurrency(card.value as number ?? 0).split(",")[0]
                                            : card.value ?? ""
                                    }
                                    subtitle={card.title}
                                    description={card.description || ""}
                                    onClick={() => {
                                        if (card.type === "interactive" || card.type === "action") {
                                            if (card.modalId === "opening-cashier") {
                                                setCurrentCashier(null);
                                            }
                                            openModal(card.modalId as string);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="relative lg:min-w-[400px]">
                                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Pesquisar caixas..." className="pl-10 h-10 w-full" />
                            </div>
                            <div className="flex items-center bg-muted/30 p-1 rounded-md border border-muted-foreground/10 gap-1">
                                <Button
                                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                                    className={cn(viewMode === "grid" ? "text-primary" : "text-muted-foreground")}
                                    size="icon"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Icon name="LayoutGrid" size={30} />
                                </Button>
                                <Button
                                    variant={viewMode === "table" ? "secondary" : "ghost"}
                                    className={cn(viewMode === "table" ? "text-primary" : "text-muted-foreground")}
                                    size="icon"
                                    onClick={() => setViewMode("table")}
                                >
                                    <Icon name="TableProperties" size={30} />
                                </Button>
                            </div>
                            <Select defaultValue="estado">
                                <SelectTrigger className="w-[140px] h-10">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="estado">Estado</SelectItem>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <PosCashierList
                        cashiers={cashiers}
                        isLoading={isLoading}
                        viewMode={viewMode}
                    />
                </section>
            </div>

            {/* Modals */}
            <PosOpeningModal />
            <PosRequestsModal />
            <PosDeleteModal />
        </div>
    );
}
