import { cn } from "@/lib";

type SummaryCardProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

export function SummaryCard({ label, value, highlight }: SummaryCardProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div
        className={cn("p-3 text-2xl font-bold rounded-lg bg-card text-foreground", {
          "text-primary": highlight
        })}>
        {value || "0.00"} Kz
      </div>
    </div>
  );
}
