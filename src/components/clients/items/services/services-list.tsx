"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  ButtonOnlyAction,
  ProductCardSkeletonGrid,
} from "@/components";
import { ItemResponse } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { useItemsFilters, useServiceActions } from "@/hooks";
import { useDebounce } from "use-debounce";
import {
  DeleteItemModal,
  ItemPaginationControls,
  ItemsFiltersTSX,
  ItemStatusBadge,
  ItemViewToggle,
} from "../common";
import { ServiceCardView } from "./service-card-view";
import { DetailsServiceModal, ServiceModal } from "./service-modals";

export function ServiceList() {
  const { search } = useURLSearchParams("search-items");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, setViewMode, viewMode, page, setPage } = useItemsFilters();
  const { handlerDeleteService, handlerDetailsService, handlerEditService } =
    useServiceActions();
  const {
    data: items,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<ItemResponse>({
    endpoint: "/items?type=SERVICE",
    queryKey: ["items"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<ItemResponse>[] = [
    { key: "name", header: "Nome" },
    {
      key: "price",
      header: "Preço",
      render: (_, item) => (
        <div className="text-sm text-foreground">
          {formatCurrency(item.price)}
        </div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      render: (_, item) => (
        <div className="text-sm text-foreground">
          {item.sku || "---"}
        </div>
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
      key: "status",
      header: "Status",
      render: (_, item) => <ItemStatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          handleDelete={handlerDeleteService}
          handleEdit={handlerEditService}
          handleSee={handlerDetailsService}
        />
      ),
    },
  ];

  if (isLoading)
    return viewMode === "card" ? <ProductCardSkeletonGrid /> : <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os produtos" />
    )
  }

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <ItemsFiltersTSX />
          <ItemViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {viewMode === "card" ? (
        <div
          className={`w-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`}
        >
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Nenhum serviço encontrado
            </p>
          ) : (
            items.map((service) => (
              <ServiceCardView key={service.id} service={service} />
            ))
          )}
        </div>
      ) : (
        <GenericTable<ItemResponse>
          page={page}
          data={items}
          total={total}
          setPage={setPage}
          columns={columns}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      )}

      {viewMode === "card" && totalPages > 1 && (
        <ItemPaginationControls
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      )}
      <DetailsServiceModal />
      <DeleteItemModal type="Serviço" />
      <ServiceModal action="edit" />
    </div>
  );
}
