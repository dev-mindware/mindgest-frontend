import type { ReactNode } from "react";

type PrinterSectionProps = {
  title: string;
  children: ReactNode;
};

/** Bloco com título, no mesmo estilo do separador Workspace. */
export function PrinterSection({ title, children }: PrinterSectionProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] px-1">
        {title}
      </p>
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}
