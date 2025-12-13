"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
    Column,
    RequestError,
    GenericTable,
    ListSkeleton,
    EmptyState,
    ButtonOnlyAction,
    Badge,
} from "@/components";
import { InvoiceResponse } from "@/types";
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { InvoiceFiltersTSX } from "../common";
import { useState } from "react";
import { proformaService } from "@/services/proforma-service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useProformaActions } from "@/hooks";

export function ProformaList() {
    const { search } = useURLSearchParams("search");
    const [debounceSearch] = useDebounce(search, 400);
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    const { handlerDeleteProforma } = useProformaActions();

    const {
        data: proformas,
        total,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        isLoading,
        isError,
        refetch,
    } = usePagination<InvoiceResponse>({
        endpoint: "/invoice/proforma",
        queryKey: ["proforma"],
        queryParams: { page, search: debounceSearch },
    });

    const columns: Column<InvoiceResponse>[] = [
        { key: "number", header: "Número da Proforma" },
        {
            key: "client",
            header: "Cliente",
            render: (_, item) => {
                return item.client?.name || item.clientId;
            },
        },
        {
            key: "total",
            header: "Valor",
            render: (_, item) => `${parseFloat(item.total).toFixed(2)} AOA`
        },
        {
            key: "createdAt",
            header: "Criado em",
            render: (_, item) => (
                <div className="text-sm text-foreground">
                    {formatDateTime(item.createdAt)}
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (_: any, item: any) => {
                const map: Record<string, string> = {
                    DRAFT: "Rascunho",
                    CANCELLED: "Cancelada",
                    ACTIVE: "Ativa",
                };

                const status = item.status ?? "DRAFT";

                return (
                    <Badge>
                        {map[status] || status}
                    </Badge>
                );
            },
        },
        {
            key: "action",
            header: "Ação",
            render: (_, item) => (
                <ButtonOnlyAction
                    data={item}
                    deleteLabel="Cancelar Proforma"
                    seeLabel="Ver Proforma"
                    handleDelete={handlerDeleteProforma}
                />
            ),
        },
    ];

    if (isLoading) return <ListSkeleton />;

    if (isError) {
        return (
            <RequestError refetch={refetch} message="Erro ao carregar as proformas" />
        );
    }

    if (proformas?.length == 0)
        return (
            <div className="justify-start mt-6 space-y-8">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
                        <InvoiceFiltersTSX />
                    </div>
                </div>
                <EmptyState
                    description="Nenhuma proforma encontrada"
                    title="Sem Proformas"
                    icon="FileText"
                />
            </div>
        );

    return (
        <div className="justify-start mt-6 space-y-8">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
                    <InvoiceFiltersTSX />
                </div>
            </div>

            <GenericTable<InvoiceResponse>
                page={page}
                data={proformas}
                columns={columns}
                total={total}
                totalPages={totalPages}
                setPage={setPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                emptyMessage="Nenhuma proforma encontrada"
            />

        </div>
    );
}
