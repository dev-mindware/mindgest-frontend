export type ImportRowStatus = "CREATED" | "VALID" | "SKIPPED" | "ERROR";

export interface ImportRowResult {
  row: number;
  name: string | null;
  status: ImportRowStatus;
  itemId?: string;
  reasons?: string[];
}

export interface ImportItemsResult {
  dryRun: boolean;
  total: number;
  /** Criados (ou válidos, em dryRun) */
  created: number;
  /** Ignorados por duplicado */
  skipped: number;
  /** Com erro de validação */
  failed: number;
  results: ImportRowResult[];
}
