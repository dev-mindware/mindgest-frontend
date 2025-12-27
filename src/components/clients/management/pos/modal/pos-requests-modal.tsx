"use client";

import React from "react";
import {
    GlobalModal,
    Button,
    Icon,
    Card,
    CardContent,
} from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { openingRequests } from "../data";

export function PosRequestsModal() {
    const { closeModal } = useModal();

    const handleClose = () => {
        closeModal("pos-requests");
    };
    return (
        <GlobalModal
            id="pos-requests"
            title="Solicitações de Abertura"
            description="Gerencie os pedidos de abertura de caixa dos seus funcionários"
            canClose
            className="sm:max-w-[500px]"
        >
            <div className="space-y-4 pt-4">
                <div className="space-y-3">
                    {openingRequests.map((request, idx) => (
                        <div
                            key={request.id}
                            className={`p-4 flex items-start gap-4 hover:bg-muted/10 transition-colors cursor-pointer rounded-xl border border-muted-foreground/10`}
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/5">
                                <Icon name="LayoutGrid" className="w-5 h-5 text-primary" />
                            </div>
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-[12px] font-medium leading-tight text-foreground/80 line-clamp-2">{request.message}</p>
                                    <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap pt-0.5">{request.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" className="text-xs">Aprovar</Button>
                                    <Button size="sm" variant="ghost" className="text-xs">Recusar</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {openingRequests.length === 0 && (
                    <div className="py-12 text-center space-y-3">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                            <Icon name="Inbox" className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Nenhuma solicitação pendente</p>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={handleClose}>Fechar</Button>
                </div>
            </div>
        </GlobalModal>
    );
}
