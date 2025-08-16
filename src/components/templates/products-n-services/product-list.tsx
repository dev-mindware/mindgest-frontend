"use client";
import { useState, useEffect } from "react";
import {
  Icon,
  Input,
  Button,
  Popover,
  Checkbox,
  SeeProduct,
  EditProduct,
  DeleteProduct,
  PopoverContent,
  PopoverTrigger,
} from "@/components";
import { OrderItem, Product } from "@/types";
import { initialProducts } from "./data";
import { ProductCardView } from "./product-card-view"
import { ProductTableView } from "./product-table-view"

interface ProductListProps {
  onAddToOrder?: (item: OrderItem) => void;
  className?: string;
  showSwitcherOnMobile?: boolean;
  size?: "medium" | "large";
}

type SortByType = "az" | "za" | "price-max" | "price-min";

export function ProductList({
  onAddToOrder,
  className,
  showSwitcherOnMobile = true,
  size,
}: ProductListProps) {
  const [search, setSearch] = useState("");
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByType>("az");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const itemsPerPage = viewMode === "card" ? 6 : 10;
  const uniqueCategories = [...new Set(initialProducts.map((p) => p.category))];

  useEffect(() => {
    setCurrentPage(1);
  }, [search, showActive, showInactive, categoryFilter, sortBy, viewMode]);

  const filteredProducts = initialProducts
    .filter((p: Product) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        (showActive && p.isActive) || (showInactive && !p.isActive);
      const matchCategory =
        categoryFilter.length === 0 || categoryFilter.includes(p.category);

      return matchSearch && matchStatus && matchCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        case "price-max":
          return b.retailPrice.max - a.retailPrice.max;
        case "price-min":
          return a.retailPrice.min - b.retailPrice.min;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (category: string) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter([]);
    setShowActive(true);
    setShowInactive(true);
    setSortBy("az");
  };

  const areFiltersActive =
    search !== "" || categoryFilter.length > 0 || !showActive || !showInactive;

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
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
              <div className="relative w-full">
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar produtos..."
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={
                      !showActive || !showInactive ? "default" : "outline"
                    }
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
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="status-active"
                      checked={showActive}
                      onCheckedChange={(val) => setShowActive(val as boolean)}
                    />
                    <label htmlFor="status-active" className="cursor-pointer">
                      Ativo
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="status-inactive"
                      checked={showInactive}
                      onCheckedChange={(val) => setShowInactive(val as boolean)}
                    />
                    <label htmlFor="status-inactive" className="cursor-pointer">
                      Inativo
                    </label>
                  </div>
                </PopoverContent>
              </Popover>
              <select
                className="w-full h-10 px-3 text-sm border rounded-md border-input bg-background sm:w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortByType)}
              >
                <option value="az">Ordenar em A-Z</option>
                <option value="za">Ordenar em Z-A</option>
                <option value="price-max">Maior Preço</option>
                <option value="price-min">Menor Preço</option>
              </select>
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
        <div className="text-sm text-muted-foreground">
          {filteredProducts.length} resultados encontrados
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
          <ProductTableView
            products={paginatedProducts}
            onAddToOrder={onAddToOrder}
          />
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
      <EditProduct />
    </div>
  );
}
