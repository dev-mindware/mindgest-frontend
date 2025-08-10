import { cn } from "@/lib/utils";
import { Icon } from "../layout/icon";

export function IconCheckSucessfull({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-20 h-20 rounded-full bg-green-0 flex items-center justify-center",
        className
      )}
    >
      <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center">
        <Icon name="Check" size={24} className="text-green-600" />
      </div>
    </div>
  );
}