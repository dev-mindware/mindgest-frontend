import { cn } from "@/lib/utils";
import { Icon } from "../icon";


export function IconWarning({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-20 h-20  rounded-full flex items-center justify-center",
        className
      )}
    >
      <div className="bg-amber-500/20 w-14 h-14 rounded-full flex items-center justify-center">
        <Icon name="TriangleAlert" className="w-24 text-amber-500" />
      </div>
    </div>
  );
}