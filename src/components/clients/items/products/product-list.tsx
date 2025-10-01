"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import { ProductCardView } from "./product-card-view";
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
import { DetailsProductModal, EditProductModal } from "./product-modals";
import { useItemsFilters, useProductActions } from "@/hooks";
import {
  DeleteItemModal,
  ItemPaginationControls,
  ItemsFiltersTSX,
  ItemStatusBadge,
  ItemViewToggle,
} from "../common";
import { useDebounce } from "use-debounce";

export function ProductList() {
  const { search } = useURLSearchParams("search-item");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, setViewMode, viewMode, page, setPage } = useItemsFilters();
  const { handlerDeleteProduct, handlerDetailsProduct, handlerEditProduct, toggleStatusProduct } = useProductActions();
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
    endpoint: "/items?type=PRODUCT",
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
    { key: "sku", header: "SKU" },
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
          handleDelete={handlerDeleteProduct}
          handleEdit={handlerEditProduct}
          handleSee={handlerDetailsProduct}
          auxAction={toggleStatusProduct}
          auxActionLabel={item.status === "ACTIVE" ? "Desativar" : "Ativar"}
        />
      ),
    },
  ];

  if (isLoading)
    return viewMode === "card" ? <ProductCardSkeletonGrid /> : <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os produtos" />
    );
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
        <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <p className="text-muted-foreground py-12">
              Nenhum produto encontrado
            </p>
          ) : (
            items.map((product) => (
              <ProductCardView key={product.id} product={product} />
            ))
          )}
        </div>
      ) : (
        <GenericTable<ItemResponse>
          data={items}
          columns={columns}
          page={page}
          total={total}
          totalPages={totalPages}
          setPage={setPage}
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

      <DetailsProductModal />
      <DeleteItemModal type="Produto" />
      <EditProductModal />
    </div>
  );
}