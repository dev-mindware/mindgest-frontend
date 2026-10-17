"use client";

import { useRef, useState } from "react";
import { Button, GlobalModal, Icon } from "@/components";
import { useModal } from "@/stores";
import { useImportItems } from "@/hooks";
import { itemsService } from "@/services/items-service";
import { ErrorMessage, SucessMessage } from "@/utils/messages";
import type { ImportItemsResult, ImportRowStatus } from "@/types";

export const IMPORT_PRODUCTS_MODAL_ID = "import-products";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const STATUS_LABEL: Record<ImportRowStatus, string> = {
  CREATED: "Criado",
  VALID: "Válido",
  SKIPPED: "Ignorado",
  ERROR: "Erro",
};

const STATUS_CLASS: Record<ImportRowStatus, string> = {
  CREATED: "text-green-600",
  VALID: "text-green-600",
  SKIPPED: "text-amber-600",
  ERROR: "text-destructive",
};

export function ImportProductsModal() {
  const { open, closeModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportItemsResult | null>(null);
  const { mutateAsync, isPending } = useImportItems();

  if (!open[IMPORT_PRODUCTS_MODAL_ID]) return null;

  const done = !!result && !result.dryRun;
  const canConfirm =
    !!result && result.dryRun && result.created > 0 && !isPending;

  function reset() {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleClose() {
    reset();
    closeModal(IMPORT_PRODUCTS_MODAL_ID);
  }

  function handleFile(selected: File | undefined) {
    setResult(null);
    if (!selected) return setFile(null);
    if (!selected.name.toLowerCase().endsWith(".xlsx")) {
      ErrorMessage("Apenas ficheiros .xlsx são aceites.");
      return setFile(null);
    }
    if (selected.size > MAX_FILE_SIZE) {
      ErrorMessage("O ficheiro excede o limite de 5MB.");
      return setFile(null);
    }
    setFile(selected);
  }

  async function run(dryRun: boolean) {
    if (!file) return;
    try {
      const data = await mutateAsync({ file, dryRun });
      setResult(data);
      if (!dryRun) {
        SucessMessage(`${data.created} produto(s) importado(s).`);
      }
    } catch {
      // erro já mostrado pelo hook
    }
  }

  async function downloadTemplate() {
    try {
      const blob = await itemsService.downloadImportTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modelo-importacao-stock.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      ErrorMessage("Não foi possível descarregar o modelo.");
    }
  }

  const problems = result?.results.filter((r) => r.status !== "CREATED" && r.status !== "VALID") ?? [];

  return (
    <GlobalModal
      canClose
      id={IMPORT_PRODUCTS_MODAL_ID}
      title="Importar stock via Excel"
      description="Carregue o modelo preenchido (máx. 1000 linhas). Primeiro valida, depois confirma a importação."
      className="!max-h-[85vh] w-full max-w-2xl"
      footer={
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {done ? "Fechar" : "Cancelar"}
          </Button>
          {!done && !canConfirm && (
            <Button onClick={() => run(true)} disabled={!file || isPending}>
              {isPending ? "A validar..." : "Validar ficheiro"}
            </Button>
          )}
          {canConfirm && (
            <Button onClick={() => run(false)} disabled={isPending}>
              {`Importar ${result!.created} produto(s)`}
            </Button>
          )}
          {isPending && !!result && (
            <span className="text-sm text-muted-foreground self-center">A importar...</span>
          )}
        </div>
      }
    >
      <div className="space-y-4 overflow-y-auto pr-1">
        {!done && (
          <div className="space-y-3">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Icon name="Download" className="mr-2 h-4 w-4" />
              Descarregar modelo
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              disabled={isPending}
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border file:bg-background file:px-3 file:py-1.5"
            />
            <p className="text-xs text-muted-foreground">
              Colunas obrigatórias: Nome e Preço de venda. Produtos com nome ou
              código de barras já existentes são ignorados. A categoria deve já
              existir na loja.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md border p-2">
                <div className="text-lg font-bold text-green-600">{result.created}</div>
                {result.dryRun ? "Prontos" : "Criados"}
              </div>
              <div className="rounded-md border p-2">
                <div className="text-lg font-bold text-amber-600">{result.skipped}</div>
                Ignorados
              </div>
              <div className="rounded-md border p-2">
                <div className="text-lg font-bold text-destructive">{result.failed}</div>
                Com erro
              </div>
            </div>

            {problems.length > 0 && (
              <div className="max-h-64 overflow-y-auto rounded-md border text-sm">
                <table className="w-full">
                  <thead className="sticky top-0 bg-muted text-left text-xs">
                    <tr>
                      <th className="p-2">Linha</th>
                      <th className="p-2">Produto</th>
                      <th className="p-2">Estado</th>
                      <th className="p-2">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((r) => (
                      <tr key={r.row} className="border-t align-top">
                        <td className="p-2">{r.row}</td>
                        <td className="p-2">{r.name ?? "—"}</td>
                        <td className={`p-2 ${STATUS_CLASS[r.status]}`}>
                          {STATUS_LABEL[r.status]}
                        </td>
                        <td className="p-2">{r.reasons?.join("; ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.dryRun && result.created === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma linha válida para importar. Corrija o ficheiro e valide de novo.
              </p>
            )}
            {!done && (
              <Button variant="ghost" size="sm" onClick={reset} disabled={isPending}>
                Escolher outro ficheiro
              </Button>
            )}
          </div>
        )}
      </div>
    </GlobalModal>
  );
}
