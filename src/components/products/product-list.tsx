"use client";
import {
  Icon,
  Input,
  Button,
  Popover,
  Checkbox,
  PopoverContent,
  PopoverTrigger,
} from "@/components";
import { ProductStatus, initialProducts } from "@/types";
import { ProductCardView } from "./product-card-view";
import { ProductTableView } from "./product-table-view";
import { useProductFilters } from "@/hooks";
import { DeleteProduct, EditProduct, SeeProduct } from "./product-modals";

interface ProductListProps {
  className?: string;
  showSwitcherOnMobile?: boolean;
  size?: "medium" | "large";
}

export function ProductList({
  className,
  showSwitcherOnMobile = true,
  size,
}: ProductListProps) {
  const {
    search,
    setSearch,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    categoryFilter,
    handleCategoryChange,
    statusFilter,
    handleStatusChange,
    paginatedProducts,
    uniqueCategories,
    totalResults,
    totalPages,
    clearFilters,
    areFiltersActive,
  } = useProductFilters(initialProducts, "card");

  const switcherClasses = showSwitcherOnMobile
    ? "flex self-center gap-2 p-1 rounded-md shrink-0 bg-sidebar border"
    : "hidden sm:flex self-center gap-2 p-1 rounded-md shrink-0 bg-sidebar border";

  const sizeClasses =
    size === "medium"
      ? "max-w-screen-sm mx-auto space-y-4 md:max-w-screen-lg"
      : "max-w-screen-sm mx-auto space-y-4 md:max-w-screen-xl";

  return (
    <div className="justify-start mt-10 bg-background">
      <div className={sizeClasses}>
        {/* === PAINEL DE FILTROS E CONTROLES === */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
              {/* Pesquisa */}
              <div className="relative w-full">
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar serviços..."
                  className="w-full h-10 text-sm border rounded-md ps-10 pe-10 border-input bg-background"
                />
                <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3 text-muted-foreground">
                  <Icon name="Search" size={16} />
                </div>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={categoryFilter.length > 0 ? "default" : "outline"}
                    size="sm"
                    className="w-full h-10 gap-2 sm:w-auto"
                  >
                    <Icon name="ListFilter" className="w-4 h-4" />
                    Categoria{" "}
                    {categoryFilter.length > 0 && `(${categoryFilter.length})`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 space-y-2">
                  <p className="p-1 text-sm font-medium">
                    Selecionar categoria
                  </p>
                  {uniqueCategories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-2 p-1 rounded hover:bg-muted"
                    >
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={categoryFilter.includes(cat)}
                        onCheckedChange={() => handleCategoryChange(cat)}
                      />
                      <label
                        htmlFor={`cat-${cat}`}
                        className="text-sm cursor-pointer"
                      >
                        {cat}
                      </label>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Filtro de Status (Atualizado) */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={areFiltersActive ? "default" : "outline"}
                    size="sm"
                    className="w-full h-10 gap-2 sm:w-auto"
                  >
                    <Icon name="Tag" className="w-4 h-4" />
                    Status
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Filtrar por status
                  </p>
                  {Object.values(ProductStatus).map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={statusFilter.includes(status)}
                        onCheckedChange={() => handleStatusChange(status)}
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="cursor-pointer"
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Ordenação */}
              <select
                className="w-full h-10 px-3 text-sm border rounded-md border-input bg-background sm:w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="az">Ordenar de A-Z</option>
                <option value="za">Ordenar de Z-A</option>
                <option value="price-max">Maior Preço</option>
                <option value="price-min">Menor Preço</option>
              </select>

              {/* Botão Limpar Filtros */}
              {areFiltersActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-10 text-destructive hover:text-destructive"
                >
                  <Icon name="X" className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              )}
            </div>

            {/* Seletor de Visualização (Card/Tabela) */}
            <div className={switcherClasses}>
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                className={`h-8 w-8 ${
                  viewMode === "card"
                    ? "bg-sidebar border hover:bg-sidebar"
                    : ""
                }`}
                onClick={() => setViewMode("card")}
              >
                <Icon
                  name="LayoutGrid"
                  size={16}
                  className={`text-muted-foreground ${
                    viewMode === "card" ? "text-primary" : ""
                  }`}
                />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                className={`h-8 w-8 ${
                  viewMode === "table"
                    ? "bg-sidebar border hover:bg-sidebar"
                    : ""
                }`}
                onClick={() => setViewMode("table")}
              >
                <Icon
                  name="Grid3x3"
                  size={16}
                  className={`text-muted-foreground ${
                    viewMode === "table" ? "text-primary" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* === LISTA DE SERVIÇOS E PAGINAÇÃO === */}
        <div className="text-sm text-muted-foreground">
          {totalResults} resultado(s) encontrado(s)
        </div>

        {viewMode === "card" ? (
          <div
            className={`w-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${
              className ?? ""
            }`}
          >
            {paginatedProducts.map((product) => (
              <ProductCardView key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <ProductTableView products={paginatedProducts} />
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>

      <DeleteProduct />
      <SeeProduct />
      <EditProduct   />
    </div>
  );
}
