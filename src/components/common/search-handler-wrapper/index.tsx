"use client";
import { cn } from "@/lib";
import { Input, Icon } from "@/components";

type Props = {
  children?: React.ReactNode;
  search: string;
  className?: string;
  setSearch: (search: string) => void;
};

export function SearchHandlerWrapper({
  children,
  search,
  setSearch,
  className,
}: Props) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="w-full flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon
            name="Search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          />
          <Input
            value={search}
            placeholder="Pesquisar..."
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 py-2"
          />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
