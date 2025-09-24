"use client";
import { Icon, Input, Button, Popover, Checkbox, PopoverTrigger, PopoverContent } from "@/components";

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  categoryFilter: string[];
  uniqueCategories: string[];
  handleCategoryChange: (cat: string) => void;
  statusFilter: string[];
  allStatus: string[];
  handleStatusChange: (status: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  areFiltersActive: boolean;
  clearFilters: () => void;
}

export function Filters({
  search, setSearch,
  categoryFilter, uniqueCategories, handleCategoryChange,
  statusFilter, allStatus, handleStatusChange,
  sortBy, setSortBy,
  areFiltersActive, clearFilters
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      {/* === Pesquisa === */}
      <div className="relative w-full sm:w-64">
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar..."
          className="w-full h-10 ps-10"
        />
        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
          <Icon name="Search" size={16} className="text-muted-foreground" />
        </div>
      </div>

      {/* === Categoria === */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={categoryFilter.length ? "default" : "outline"} size="sm">
            <Icon name="ListFilter" className="w-4 h-4" />
            Categoria {categoryFilter.length > 0 && `(${categoryFilter.length})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 space-y-2">
          {uniqueCategories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                checked={categoryFilter.includes(cat)}
                onCheckedChange={() => handleCategoryChange(cat)}
              />
              <span>{cat}</span>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      {/* === Status === */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={statusFilter.length ? "default" : "outline"} size="sm">
            <Icon name="Tag" className="w-4 h-4" /> Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 space-y-2">
          {allStatus.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <Checkbox
                checked={statusFilter.includes(status)}
                onCheckedChange={() => handleStatusChange(status)}
              />
              <span>{status}</span>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      {/* === Ordenação === */}
      <select
        className="h-10 border rounded-md px-3"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="price-max">Maior Preço</option>
        <option value="price-min">Menor Preço</option>
      </select>

      {areFiltersActive && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
          <Icon name="X" className="w-4 h-4 mr-1" /> Limpar
        </Button>
      )}
    </div>
  );
}
