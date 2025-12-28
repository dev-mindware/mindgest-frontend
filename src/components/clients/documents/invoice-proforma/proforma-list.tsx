"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  EmptyState,
  RequestError,
  GenericTable,
  ListSkeleton,
  ButtonOnlyAction,
  ProformaPreviewDrawer,
} from "@/components";
import { InvoiceResponse } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { DocumentStatusBadge, InvoiceFiltersTSX } from "../common";
import { useInvoiceFilters, useProformaActions } from "@/hooks";
import { DeleteProformaModal } from "../modals";
import { useRouter } from "next/navigation";

export function ProformaList() {
  const router = useRouter();
  const { search } = useURLSearchParams("search_proforma");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useInvoiceFilters("proforma");
  const {
    handlerDeleteProforma,
    handlerDetailsProforma 
  } = useProformaActions();
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
    queryKey: ["invoice-proforma"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<InvoiceResponse>[] = [
    { key: "number", header: "N° da Proforma" },
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => item?.client?.name ?? "N/A",
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => `${formatCurrency(item.total)}`,
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
      header: "Estado",
      render: (_, item) => <DocumentStatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            { label: "Ver Proforma", onClick: handlerDetailsProforma },
            {
              label: "Editar",
              onClick: () => {
                router.push(`/client/documents/${item.id}/edit`);
              },
            },
            ...(item.status !== "CANCELLED"
              ? [
                  {
                    label: "Deletar",
                    onClick: handlerDeleteProforma,
                  },
                ]
              : []),
          ]}
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

  return (
    <div className="justify-start mt-6 space-y-8">
      <InvoiceFiltersTSX type="proforma" />
      {proformas.length > 0 ? (
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
      ) : (
        <div className="justify-start mt-6 space-y-8">
          <EmptyState
            description="Nenhuma proforma encontrada"
            title="Sem Proformas"
            icon="FileText"
          />
        </div>
      )}

      <ProformaPreviewDrawer />
      <DeleteProformaModal />
    </div>
  );
}
