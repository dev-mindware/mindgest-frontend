"use client";
import { useState } from "react";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import { ProductCardView } from "./product-card-view";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  ButtonOnlyAction,
  ProductCardSkeletonGrid,
  ItemsFiltersSkeleton,
  Button,
} from "@/components";
import { Trash2 } from "lucide-react";
import { ItemResponse } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import {
  DetailsProductModal,
  AddProductModal,
  EditProductModal,
  BulkDeleteProductsModal,
} from "./product-modals";
import { useItemsFilters, useProductActions } from "@/hooks";
import {
  DeleteItemModal,
  ItemPaginationControls,
  ItemsFiltersTSX,
  ItemStatusBadge,
  ItemViewToggle,
} from "../common";
import { useDebounce } from "use-debounce";
import { currentStoreStore, currentProductStore } from "@/stores";

export function ProductList() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const { search } = useURLSearchParams(`search_product`);
  const { currentStore } = currentStoreStore();
  const { currentProduct } = currentProductStore();
  const [debounceSearch] = useDebounce(search, 200);
  const { filters, setViewMode, viewMode, page, setPage } =
    useItemsFilters("product");
  const {
    handlerDeleteProduct,
    handlerDetailsProduct,
    handlerEditProduct,
    toggleStatusProduct,
  } = useProductActions();
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
    endpoint: "/items",
    queryKey: ["items", "product"],
    queryParams: {
      ...filters,
      type: "PRODUCT",
      search: debounceSearch,
      page,
      ...(currentStore?.id && { storeId: currentStore.id }),
    },
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
        <div className="text-sm text-foreground">{item.sku || "------"}</div>
      ),
    },
    {
      key: "taxId",
      header: "Imposto",
      render: (_, item) => (
        <div className="text-sm text-foreground">
          {item.tax?.rate ? `${item.tax.rate}%` : "Isento"}
        </div>
      ),
    },

    {
      key: "quantity",
      header: "Quantidade",
      render: (_, item) => (
        <div className="text-sm text-foreground">{item.quantity}</div>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (_, item) => <ItemStatusBadge status={item.status} />,
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
      header: "Acção",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            {
              label: "Ver detalhes",
              onClick: handlerDetailsProduct,
              icon: "Eye",
              variant: "default",
            },
            {
              label: "Editar",
              onClick: handlerEditProduct,
              icon: "Pencil",
              variant: "default",
            },
            {
              label: item.status === "ACTIVE" ? "Desactivar" : "Activar",
              onClick: toggleStatusProduct,
              icon: "CirclePower",
              variant: "default",
            },
            { type: "separator" },
            {
              label: "Apagar",
              onClick: handlerDeleteProduct,
              icon: "Trash2",
              variant: "destructive",
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="justify-start mt-6 space-y-8">
        <ItemsFiltersSkeleton />
        {viewMode === "card" ? <ProductCardSkeletonGrid /> : <ListSkeleton />}
      </div>
    );
  }

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os produtos" />
    );
  }

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full items-center gap-3 sm:flex-row sm:justify-between sm:gap-4 sm:items-start">
          <ItemsFiltersTSX prefix="product" />
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span className="font-semibold text-xs sm:text-sm">
                  Eliminar ({selectedIds.length})
                </span>
              </Button>
            )}
            <ItemViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <p className="py-12 text-muted-foreground">
              Nenhum produto encontrado
            </p>
          ) : (
            items.map((product) => (
              <ProductCardView
                key={product.id}
                product={product}
                selectable={true}
                selected={selectedIds.includes(product.id)}
                onToggleSelect={(id) => {
                  setSelectedIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((item) => item !== id)
                      : [...prev, id]
                  );
                }}
              />
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
          selectable={true}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
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
      <AddProductModal />
      {currentProduct && <EditProductModal product={currentProduct} />}
      <BulkDeleteProductsModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        selectedIds={selectedIds}
        onSuccess={() => setSelectedIds([])}
      />

    </div>
  );
}
