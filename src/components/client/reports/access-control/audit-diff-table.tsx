"use client";
import { AuditTrailAction } from "@/types";

interface AuditDiffTableProps {
  action: AuditTrailAction;
  changes: Record<string, { from: any; to: any }> | null;
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
}

// Helper to format values for display
export const formatValue = (val: any): string => {
  if (val === null || val === undefined) return "N/A";
  if (typeof val === "boolean") return val ? "Sim" : "Não";
  if (typeof val === "object") {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return "[Objeto]";
    }
  }
  return String(val);
};

export function AuditDiffTable({ action, changes, oldValues, newValues }: AuditDiffTableProps) {
  if (action === "UPDATE" && changes && Object.keys(changes).length > 0) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-muted border-b">
              <th className="p-3 font-semibold text-muted-foreground w-1/4">Campo</th>
              <th className="p-3 font-semibold text-muted-foreground w-3/8">Valor Anterior</th>
              <th className="p-3 font-semibold text-muted-foreground w-3/8">Valor Novo</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(changes).map(([field, diff]) => (
              <tr key={field} className="border-b hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground capitalize">{field}</td>
                <td className="p-3 text-red-600 dark:text-red-400 bg-red-500/5 line-through whitespace-pre-wrap font-mono">
                  {formatValue(diff.from)}
                </td>
                <td className="p-3 text-green-600 dark:text-green-400 bg-green-500/5 font-semibold whitespace-pre-wrap font-mono">
                  {formatValue(diff.to)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (action === "CREATE" && newValues && Object.keys(newValues).length > 0) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-muted border-b">
              <th className="p-3 font-semibold text-muted-foreground w-1/3">Campo</th>
              <th className="p-3 font-semibold text-muted-foreground w-2/3">Valor Inserido</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(newValues).map(([field, val]) => (
              <tr key={field} className="border-b hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground capitalize">{field}</td>
                <td className="p-3 text-green-600 dark:text-green-400 bg-green-500/5 font-semibold whitespace-pre-wrap font-mono">
                  {formatValue(val)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (action === "DELETE" && oldValues && Object.keys(oldValues).length > 0) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-muted border-b">
              <th className="p-3 font-semibold text-muted-foreground w-1/3">Campo</th>
              <th className="p-3 font-semibold text-muted-foreground w-2/3">Valor Deletado</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(oldValues).map(([field, val]) => (
              <tr key={field} className="border-b hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground capitalize">{field}</td>
                <td className="p-3 text-red-600 dark:text-red-400 bg-red-500/5 line-through whitespace-pre-wrap font-mono">
                  {formatValue(val)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
      Nenhuma alteração de valores registrada para esta ação.
    </div>
  );
}
