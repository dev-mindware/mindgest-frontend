"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Badge,
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  EmptyState,
  ButtonOnlyAction,
  ReceiptPreviewDrawer,
} from "@/components";
import { formatCurrency, formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { paymentMethodMap } from "@/constants";
import { useInvoiceFilters } from "@/hooks/invoice";
import { InvoiceFiltersTSX } from "../common";
import { useReceiptActions } from "@/hooks";
import { ReceiptResponse } from "@/types/receipt";

export function ReceiptList() {
  const { search } = useURLSearchParams("receipt");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useInvoiceFilters("receipt");
  const {
    data: receipts,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<ReceiptResponse>({
    endpoint: "/invoice/receipt",
    queryKey: ["receipt"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const { handlerDetailsReceipt } = useReceiptActions();

  const handleViewReceipt = (receipt: ReceiptResponse) => {
    handlerDetailsReceipt(receipt);
  };

  const columns: Column<ReceiptResponse>[] = [
    {
      key: "originalInvoiceId",
      header: "N° do Recibo",
      render: (_, item) => item.number || "N/A",
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => formatCurrency(item.total),
    },
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => item?.client?.name || "N/A",
    },
    {
      key: "paymentMethodStr",
      header: "Método de Pagamento",
      render: (_, item) => (
        <Badge>
          {paymentMethodMap[item.paymentMethodStr] || item.paymentMethodStr}
        </Badge>
      ),
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
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[{ label: "Ver Recibo", onClick: handleViewReceipt }]}
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

  return (
    <div className="justify-start mt-6 space-y-8">
      {receipts.length > 0 ? (
        <>
          <InvoiceFiltersTSX type="receipt" />
          <GenericTable<ReceiptResponse>
            page={page}
            total={total}
            data={receipts}
            columns={columns}
            totalPages={totalPages}
            setPage={setPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            emptyMessage="Nenhum recibo encontrado"
          />
        </>
      ) : (
        <div className="justify-start mt-6 space-y-8">
          <EmptyState
            icon="FileText"
            title="Sem Recibos"
            description="Nenhum recibo encontrado"
          />
        </div>
      )}
      <ReceiptPreviewDrawer />
    </div>
  );
}
