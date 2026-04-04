"use client"
import { Icon } from "@/components/common";
import { Button } from "@/components/ui";
import { useMemo } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  goToNext: () => void;
  goToPrev: () => void;
  setPage: (p: number) => void;
}

export function PaginationBar({
  page,
  totalPages,
  total,
  goToNext,
  goToPrev,
  setPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = useMemo(() => {
    const range: (number | "...")[] = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-muted-foreground hidden sm:block">
        Total de {total} entrada{total !== 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-1 mx-auto sm:mx-0">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={goToPrev}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <Icon name="ChevronLeft" className="w-4 h-4" />
        </Button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-muted-foreground text-sm"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0 text-xs"
              onClick={() => setPage(p as number)}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={goToNext}
          disabled={page >= totalPages}
          aria-label="Próxima página"
        >
          <Icon name="ChevronRight" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}