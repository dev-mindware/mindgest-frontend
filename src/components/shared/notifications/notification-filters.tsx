"use client";
import { Button, Input, Badge, Icon } from "@/components";

interface NotificationFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: "all" | "read" | "unread";
  setFilterStatus: (value: "all" | "read" | "unread") => void;
}

export function NotificationFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}: NotificationFiltersProps) {
  return (
    <div className="bg-sidebar rounded-lg border border-border p-4 mb-6 mt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon
            name="Search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          />
          <Input
            placeholder="Buscar notificações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            Todas
          </Button>
          <Button
            variant={filterStatus === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("unread")}
          >
            Não lidas
          </Button>
          <Button
            variant={filterStatus === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("read")}
          >
            Lidas
          </Button>
        </div>
      </div>

      {(searchTerm || filterStatus !== "all") && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">Filtros ativos:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Busca: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {filterStatus !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filterStatus === "read" ? "Lidas" : "Não lidas"}
              <button
                onClick={() => setFilterStatus("all")}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
            }}
            className="text-xs"
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
