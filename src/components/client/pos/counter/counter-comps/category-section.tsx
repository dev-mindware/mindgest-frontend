"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components";
import { Button } from "@/components/ui/button";

export interface CategoryMock {
  id: string;
  name: string;
  count: number;
  icon?: string; // Icon name made optional for API data
}

interface CategorySectionProps {
  categories: CategoryMock[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategorySection({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySectionProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full mb-6 relative group">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full hidden md:flex"
          onClick={() => scroll("left")}
        >
          <Icon name="ChevronLeft" className="h-4 w-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scrollbar-hide pb-4 -mb-4 flex space-x-4 p-1 scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md border transition-all min-w-[140px] shrink-0",
                selectedCategory === category.id
                  ? "bg-primary/15 text-primary border-primary shadow-md"
                  : "bg-card hover:bg-muted/30 border-border"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg",
                  selectedCategory === category.id
                    ? "bg-primary/20"
                    : "bg-muted"
                )}
              >
                <Icon
                  name={(category.icon as any) || "ChartColumnStacked"}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">{category.name}</span>
                <span
                  className={cn(
                    "text-[10px]",
                    selectedCategory === category.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {category.count} items
                </span>
              </div>
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full hidden md:flex"
          onClick={() => scroll("right")}
        >
          <Icon name="ChevronRight" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
