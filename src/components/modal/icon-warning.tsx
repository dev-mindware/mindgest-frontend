import { cn } from "@/lib/utils";
import { Icon } from "@/components";

export function IconWarning({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 text-amber-500",
        className
      )}
    >
        <Icon name="TriangleAlert" className="h-12 w-12" />

    </div>
  );
}
