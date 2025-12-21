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
  DeleteSupplierModal,
  DetailsSupplierModal,
  SupplierModal,
} from "@/components";
import { SupplierResponse } from "@/types";
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { SuppliersFiltersTSX } from "./common";
import { useSupplierActions, useSuppliersFilters } from "@/hooks/entities";

export function SuppliersList() {
  const { search } = useURLSearchParams("search");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useSuppliersFilters();
  const { handlerDeleteSupplier, handlerDetailsSupplier, handlerEditSupplier } =
    useSupplierActions();
  const {
    data: suppliers,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<SupplierResponse>({
    endpoint: "/suppliers",
    queryKey: ["suppliers"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<SupplierResponse>[] = [
    { key: "name", header: "Nome" },
    { key: "taxNumber", header: "NIF" },
    {
      key: "email",
      header: "Email",
    },
    { key: "phone", header: "Telefone" },
    { key: "address", header: "Endereço" },
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
      render: (_, item) => (
        <ItemStatusBadge status={item.isActive ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            { label: "Ver detalhes", onClick: handlerDetailsSupplier },
            { label: "Editar", onClick: handlerEditSupplier },
            { label: "Deletar", onClick: handlerDeleteSupplier },
          ]}
        />
      ),
    },
  ];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os fornecedores" />
    );
  }

  if (suppliers?.length == 0)
    return (
      <EmptyState
        description="Adicione novos fornecedores"
        title="Sem Fornecedores"
        icon="Users"
      />
    );

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <SuppliersFiltersTSX />
        </div>
      </div>

      <GenericTable<SupplierResponse>
        page={page}
        data={suppliers}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhum fornecedor encontrado"
      />

      <DetailsSupplierModal />
      <DeleteSupplierModal />
      <SupplierModal action="edit" />
    </div>
  );
}
