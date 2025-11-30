"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  ItemStatusBadge,
  EmptyState,
  ButtonOnlyAction,
  Badge,
} from "@/components";
import { InvoiceResponse, ManagerResponse } from "@/types";
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { InvoiceFiltersTSX } from "./common";
import { useInvoiceActions, useInvoiceFilters } from "@/hooks/invoice";


export function InvoiceList() {
  const { search } = useURLSearchParams("search");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useInvoiceFilters();
  const { handlerGenerateReceipt, handlerCancelInvoice, handlerDetailsInvoice } =
    useInvoiceActions();
  const {
    data: invoices,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<InvoiceResponse>({
    endpoint: "/invoice/normal",
    queryKey: ["invoice-normal"],
    queryParams: { ...filters, page },
  });

  const columns: Column<InvoiceResponse>[] = [
    { key: "number", header: "Número da Fatura" },
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => {
        return item.clientId;
      },
    },
    {
      key: "total",
      header: "Valor",
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
          PAID: "Paga",
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
          deleteLabel="Cancelar Fatura"
          editLabel="Gerar Recibo"
          seeLabel="Ver Fatura"
          handleDelete={handlerCancelInvoice}
          handleEdit={handlerGenerateReceipt}
          handleSee={handlerDetailsInvoice}
        />
      ),
    },
  ];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os gerentes" />
    );
  }

  if (invoices?.length == 0)
    return (
      <div className="justify-start mt-6 space-y-8">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
            <InvoiceFiltersTSX />
          </div>
        </div>
        <EmptyState
          description="Adicione novos gerentes"
          title="Sem Gerentes"
          icon="Users"
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
        data={invoices}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhum gerente encontrado"
      />

      
    </div>
  );
}
