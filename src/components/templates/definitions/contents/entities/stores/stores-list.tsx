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
  DeleteStoreModal,
  DetailsStoreModal,
  StoreModal,
} from "@/components";
import { StoreResponse } from "@/types";
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { StoresFiltersTSX } from "./common";
import { useStoreActions, useStoresFilters } from "@/hooks/entities";

export function StoresList() {
  const { search } = useURLSearchParams("search");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useStoresFilters();
  const { handlerDeleteStore, handlerDetailsStore, handlerEditStore, toggleStatusStore } =
    useStoreActions();
  const {
    data: stores,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<StoreResponse>({
    endpoint: "/stores",
    queryKey: ["stores"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<StoreResponse>[] = [
    { key: "name", header: "Nome" },
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
            { label: "Ver detalhes", onClick: handlerDetailsStore },
            { label: "Editar", onClick: handlerEditStore },
            { label: "Deletar", onClick: handlerDeleteStore },
            {
              label: `${item.isActive ? "Desativar" : "Ativar"}`,
              onClick: toggleStatusStore,
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar as lojas" />
    );
  }

  if (stores?.length == 0)
    return (
      <EmptyState
        description="Adicione novas lojas"
        title="Sem Lojas"
        icon="Store"
      />
    );

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <StoresFiltersTSX />
        </div>
      </div>

      <GenericTable<StoreResponse>
        page={page}
        data={stores}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhuma loja encontrada"
      />

      <DetailsStoreModal />
      <DeleteStoreModal />
      <StoreModal action="edit" />
    </div>
  );
}
