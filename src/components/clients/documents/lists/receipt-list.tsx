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
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { useState } from "react";

type ReceiptData = {
    id: string;
    number: string;
    customerId: string;
    total: string;
    paymentMethodStr: string;
    client: {
        name: string;
    };
    originalInvoiceId: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
};

export function ReceiptList() {
    const { search } = useURLSearchParams("search");
    const [debounceSearch] = useDebounce(search, 400);
    const [page, setPage] = useState(1);

    const {
        data: receipts,
        total,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        isLoading,
        isError,
        refetch,
    } = usePagination<ReceiptData>({
        endpoint: "/invoice/receipt",
        queryKey: ["receipt"],
        queryParams: { page, search: debounceSearch },
    });

    const handleViewReceipt = (receipt: ReceiptData) => {
        console.log("View receipt:", receipt);
        // TODO: Implement view receipt details
    };

    const paymentMethodMap: Record<string, string> = {
        CASH: "Dinheiro",
        CARD: "Cartão",
        TRANSFER: "Transferência",
    };

    const columns: Column<ReceiptData>[] = [
        { key: "number", header: "Número do Recibo" },
        {
            key: "originalInvoiceId",
            header: "Fatura Original",
            render: (_, item) => item.originalInvoiceId || "N/A",
        },
        {
            key: "total",
            header: "Valor",
            render: (_, item) => `${parseFloat(item.total).toFixed(2)} AOA`,
        },
        {
            key: "paymentMethodStr",
            header: "Método de Pagamento",
            render: (_, item) => (
                <Badge>{paymentMethodMap[item.paymentMethodStr] || item.paymentMethodStr}</Badge>
            ),
        },
        {
            key: "client",
            header: "Cliente",
            render: (_, item) => item.client.name || "N/A",
        },
        {
            key: "createdAt",
            header: "Criado em",
            render: (_, item) => (
                <div className="text-sm text-foreground">
                    {item.createdAt}
                </div>
            ),
        },
        {
            key: "action",
            header: "Ação",
            render: (_, item) => (
                <ButtonOnlyAction
                    data={item}
                    seeLabel="Ver Recibo"
                    handleSee={handleViewReceipt}
                />
            ),
        },
    ];

    if (isLoading) return <ListSkeleton />;

    if (isError) {
        return (
            <RequestError refetch={refetch} message="Erro ao carregar os recibos" />
        );
    }

    if (receipts?.length == 0)
        return (
            <div className="justify-start mt-6 space-y-8">
                <EmptyState
                    description="Nenhum recibo encontrado"
                    title="Sem Recibos"
                    icon="FileText"
                />
            </div>
        );

    return (
        <div className="justify-start mt-6 space-y-8">
            <GenericTable<ReceiptData>
                page={page}
                data={receipts}
                columns={columns}
                total={total}
                totalPages={totalPages}
                setPage={setPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                emptyMessage="Nenhum recibo encontrado"
            />
        </div>
    );
}
