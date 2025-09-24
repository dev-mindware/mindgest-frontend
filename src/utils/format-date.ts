import { format } from "date-fns";
import { pt } from "date-fns/locale";

/**
 * Formata uma data no padrão dd/MM/yyyy HH:mm com locale pt
 * @param date Date ou string no formato ISO
 */
export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy, HH:mm", { locale: pt });
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: pt });
}
