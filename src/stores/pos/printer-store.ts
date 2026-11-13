import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MINDPRINT_DEFAULT_PORT } from "@/constants/mindprint";
import type { PaperWidth } from "@/types";

/**
 * Preferências do MindPrint guardadas neste browser (localStorage).
 * O token é por browser: Chrome e Edge emparelham em separado.
 */
interface PrinterSettingsState {
  token: string | null;
  port: number;
  /** `id` devolvido por /printers; `null` = impressora por omissão do agente. */
  printerId: string | null;
  paperWidth: PaperWidth;
  setToken: (token: string | null) => void;
  setPort: (port: number) => void;
  setPrinterId: (printerId: string | null) => void;
  setPaperWidth: (paperWidth: PaperWidth) => void;
}

export const usePrinterSettingsStore = create<PrinterSettingsState>()(
  persist(
    (set) => ({
      token: null,
      port: MINDPRINT_DEFAULT_PORT,
      printerId: null,
      paperWidth: "80mm",
      setToken: (token) => set({ token }),
      setPort: (port) => set({ port }),
      setPrinterId: (printerId) => set({ printerId }),
      setPaperWidth: (paperWidth) => set({ paperWidth }),
    }),
    {
      name: "mindprint-settings",
    },
  ),
);
