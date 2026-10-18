"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Trash2,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";
import { Button, GlobalModal, Badge } from "@/components";
import { useModal, useAuthStore } from "@/stores";
import { useImportItems } from "@/hooks";
import { itemsService } from "@/services/items-service";
import { ErrorMessage, SucessMessage } from "@/utils/messages";
import type { PlanType } from "@/types/subscription";
import type { ImportItemsResult, ImportRowStatus } from "@/types";
import { cn } from "@/lib/utils";

export const IMPORT_PRODUCTS_MODAL_ID = "import-products";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const STATUS_CONFIG: Record<
  ImportRowStatus,
  { label: string; badgeVariant: "success" | "pending" | "destructive" | "outline" }
> = {
  CREATED: { label: "Criado", badgeVariant: "success" },
  VALID: { label: "Válido", badgeVariant: "success" },
  SKIPPED: { label: "Ignorado", badgeVariant: "pending" },
  ERROR: { label: "Erro", badgeVariant: "destructive" },
};

const PLAN_FIELDS_INFO: Record<
  PlanType,
  {
    label: string;
    description: string;
    fields: { name: string; required?: boolean }[];
    hint?: string;
  }
> = {
  Base: {
    label: "Plano Base",
    description: "Modelo essencial para cadastro rápido de produtos e stock inicial.",
    fields: [
      { name: "Nome", required: true },
      { name: "Preço de Venda", required: true },
      { name: "Stock Inicial" },
      { name: "Preço de Custo" },
      { name: "Categoria" },
      { name: "Descrição" },
    ],
    hint: "Código de Barras, SKU e Stock Mínimo requerem o Plano Smart ou superior.",
  },
  Smart: {
    label: "Plano Smart",
    description: "Modelo completo com suporte a leitores de código de barras e alertas de stock.",
    fields: [
      { name: "Nome", required: true },
      { name: "Preço de Venda", required: true },
      { name: "Stock Inicial" },
      { name: "Preço de Custo" },
      { name: "Categoria" },
      { name: "Descrição" },
      { name: "Código de Barras" },
      { name: "SKU" },
      { name: "Stock Mínimo" },
    ],
    hint: "Unidade de Medida e Data de Validade por lote requerem o Plano Pro.",
  },
  Pro: {
    label: "Plano Pro",
    description: "Modelo empresarial com gestão total de catálogo, logística e controlo de validade.",
    fields: [
      { name: "Nome", required: true },
      { name: "Preço de Venda", required: true },
      { name: "Stock Inicial" },
      { name: "Preço de Custo" },
      { name: "Categoria" },
      { name: "Descrição" },
      { name: "Código de Barras" },
      { name: "SKU" },
      { name: "Stock Mínimo" },
      { name: "Unidade" },
      { name: "Validade (AAAA-MM-DD)" },
    ],
    hint: "Todos os campos do catálogo e gestão de lotes estão desbloqueados no seu plano.",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImportProductsModal() {
  const { open, closeModal } = useModal();
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportItemsResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { mutateAsync, isPending } = useImportItems();

  // Determina o plano actual da subscrição da empresa
  const rawPlan = user?.company?.subscription?.plan?.name as string | undefined;
  const currentPlan: PlanType =
    rawPlan && (rawPlan.includes("Pro") || rawPlan.includes("Tsunami"))
      ? "Pro"
      : rawPlan && rawPlan.includes("Smart")
        ? "Smart"
        : "Base";

  const planInfo = PLAN_FIELDS_INFO[currentPlan];

  if (!open[IMPORT_PRODUCTS_MODAL_ID]) return null;

  const done = !!result && !result.dryRun;
  const canConfirm = !!result && result.dryRun && result.created > 0 && !isPending;

  function reset() {
    setFile(null);
    setResult(null);
  }

  function handleClose() {
    reset();
    closeModal(IMPORT_PRODUCTS_MODAL_ID);
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setResult(null);
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const selected = acceptedFiles[0];
    if (!selected.name.toLowerCase().endsWith(".xlsx")) {
      ErrorMessage("Apenas ficheiros no formato .xlsx são aceites.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      ErrorMessage("O ficheiro excede o limite máximo de 5MB.");
      return;
    }
    setFile(selected);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isPending,
  });

  async function run(dryRun: boolean) {
    if (!file) return;
    try {
      const data = await mutateAsync({ file, dryRun });
      setResult(data);
      if (!dryRun) {
        SucessMessage(`${data.created} produto(s) importado(s) com sucesso.`);
      }
    } catch {
      // O erro já é tratado no onError do hook useImportItems
    }
  }

  async function downloadTemplate() {
    setIsDownloading(true);
    try {
      const blob = await itemsService.downloadImportTemplate(currentPlan);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `modelo-importacao-stock-${currentPlan.toLowerCase()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      SucessMessage(`Modelo para o Plano ${currentPlan} descarregado com sucesso.`);
    } catch {
      ErrorMessage("Não foi possível descarregar o modelo.");
    } finally {
      setIsDownloading(false);
    }
  }

  const problems =
    result?.results.filter((r) => r.status !== "CREATED" && r.status !== "VALID") ?? [];

  return (
    <GlobalModal
      canClose
      id={IMPORT_PRODUCTS_MODAL_ID}
      className="w-full sm:max-w-3xl border-stone-200/80 shadow-soft-lg"
      title={
        <div className="flex items-center justify-between w-full pr-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#D85A38] shrink-0 shadow-soft-sm">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 tracking-tight leading-none">
                Importar Stock em Massa
              </h2>
              <p className="text-xs text-stone-500 font-normal mt-1">
                Adicione produtos e stock inicial via folha de cálculo Excel (.xlsx)
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-orange-200 bg-orange-50/60 text-[#D85A38] font-semibold text-xs py-0.5 px-2.5"
          >
            {planInfo.label}
          </Badge>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 pt-2 border-t border-stone-200/70">
          <div className="text-xs text-stone-500 hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Valide os dados antes de gravar em definitivo.</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {done ? "Fechar" : "Cancelar"}
            </Button>

            {!done && !canConfirm && (
              <Button
                type="button"
                onClick={() => run(true)}
                disabled={!file || isPending}
                loading={isPending}
                className="w-full sm:w-auto bg-[#D85A38] hover:bg-[#C74D2C] text-white shadow-soft-sm"
              >
                {isPending ? "A validar dados..." : "Validar Ficheiro"}
              </Button>
            )}

            {canConfirm && (
              <Button
                type="button"
                onClick={() => run(false)}
                disabled={isPending}
                loading={isPending}
                className="w-full sm:w-auto bg-[#D85A38] hover:bg-[#C74D2C] text-white shadow-soft-sm font-semibold"
              >
                {isPending ? "A importar..." : `Confirmar Importação de ${result!.created} Produto(s)`}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* BANNER DO PLANO & MODELO EXCEL */}
        {!done && (
          <div className="rounded-2xl border border-stone-200/90 bg-[#FBF9F5] p-4 text-stone-900 transition-all shadow-soft-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D85A38]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Modelo Adaptado ao seu Plano ({currentPlan})
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {planInfo.description}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                loading={isDownloading}
                className="shrink-0 border-stone-300 bg-white hover:bg-stone-50 hover:text-[#D85A38] text-stone-800 shadow-soft-sm"
              >
                <Download className="mr-1.5 h-4 w-4 text-[#D85A38]" />
                Descarregar Modelo (.xlsx)
              </Button>
            </div>

            {/* CHIPS DOS CAMPOS DISPONÍVEIS */}
            <div className="mt-3 pt-3 border-t border-stone-200/60 flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-semibold text-stone-500 mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-stone-400" />
                Campos no modelo:
              </span>
              {planInfo.fields.map((f) => (
                <span
                  key={f.name}
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium border",
                    f.required
                      ? "bg-orange-50/80 text-[#B84324] border-orange-200/70 font-semibold"
                      : "bg-white text-stone-600 border-stone-200"
                  )}
                >
                  {f.name}
                  {f.required && <span className="ml-0.5 text-[#D85A38]">*</span>}
                </span>
              ))}
            </div>

            {planInfo.hint && (
              <p className="mt-2 text-[11px] text-stone-500 italic">
                * {planInfo.hint}
              </p>
            )}
          </div>
        )}

        {/* ÁREA DE CARREGAMENTO / DROPZONE */}
        {!done && (
          <div className="space-y-3">
            {!file ? (
              <div
                {...getRootProps()}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer group",
                  isDragActive
                    ? "border-[#D85A38] bg-orange-50/40"
                    : "border-stone-300 bg-stone-50/40 hover:border-[#D85A38]/70 hover:bg-[#FAF8F5]",
                  isDragReject && "border-red-400 bg-red-50/30"
                )}
              >
                <input {...getInputProps()} />
                <div className="h-12 w-12 rounded-2xl bg-white border border-stone-200 shadow-soft-sm flex items-center justify-center text-[#D85A38] group-hover:scale-105 transition-transform mb-2">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  Arraste o seu ficheiro Excel aqui, ou{" "}
                  <span className="text-[#D85A38] underline underline-offset-2">
                    procure no computador
                  </span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Apenas ficheiros no formato .xlsx (máximo de 1.000 linhas • até 5MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-white shadow-soft-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 leading-tight">
                      {file.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {formatFileSize(file.size)} • Pronto para validação
                    </p>
                  </div>
                </div>

                {!isPending && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={reset}
                    className="text-stone-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* RESULTADOS DA VALIDAÇÃO OU IMPORTAÇÃO */}
        {result && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            {/* CARDS DE RESUMO DE MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-emerald-800 leading-none">
                    {result.created}
                  </div>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    {result.dryRun ? "Prontos para Gravar" : "Criados com Sucesso"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-700 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-amber-800 leading-none">
                    {result.skipped}
                  </div>
                  <p className="text-xs font-semibold text-amber-700 mt-1">
                    Ignorados (Duplicados)
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-700 shrink-0">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-rose-800 leading-none">
                    {result.failed}
                  </div>
                  <p className="text-xs font-semibold text-rose-700 mt-1">
                    Linhas com Erro
                  </p>
                </div>
              </div>
            </div>

            {/* TABELA DE PROBLEMAS / DUPLICADOS */}
            {problems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span>Avisos e Erros Detectados ({problems.length})</span>
                  <span className="text-stone-500 font-normal">
                    Linhas duplicadas ou inválidas não serão gravadas
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto rounded-xl border border-stone-200 bg-white text-xs shadow-soft-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-stone-100 border-b border-stone-200 text-stone-700 font-semibold">
                      <tr>
                        <th className="p-2.5 w-16">Linha</th>
                        <th className="p-2.5 w-44">Produto</th>
                        <th className="p-2.5 w-24">Estado</th>
                        <th className="p-2.5">Motivo detalhado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {problems.map((r) => {
                        const statusCfg = STATUS_CONFIG[r.status];
                        return (
                          <tr key={r.row} className="hover:bg-stone-50/80 transition-colors">
                            <td className="p-2.5 font-mono font-medium text-stone-600">
                              #{r.row}
                            </td>
                            <td className="p-2.5 font-medium text-stone-900 truncate max-w-[180px]">
                              {r.name ?? "—"}
                            </td>
                            <td className="p-2.5">
                              <Badge
                                variant={statusCfg.badgeVariant}
                                className="text-[10px] py-0 px-2"
                              >
                                {statusCfg.label}
                              </Badge>
                            </td>
                            <td className="p-2.5 text-stone-600 leading-relaxed">
                              {r.reasons?.join("; ") || "Sem detalhes"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MENSAGEM SE ZERO LINHAS VÁLIDAS */}
            {result.dryRun && result.created === 0 && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Nenhum produto válido para importação.</p>
                  <p className="mt-0.5 text-rose-700">
                    Corrija os erros assinalados no seu ficheiro Excel e efectue uma nova validação.
                  </p>
                </div>
              </div>
            )}

            {/* SE SUCESSO DEFINITIVO */}
            {done && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">
                  Processo de Importação Concluído!
                </h4>
                <p className="text-xs text-emerald-700">
                  {result.created} produto(s) adicionados ao catálogo com stock inicial actualizado.
                </p>
              </div>
            )}

            {/* BOTÃO PARA TESTAR NOVO FICHEIRO */}
            {!done && (
              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  disabled={isPending}
                  className="text-xs text-stone-600 hover:text-stone-900"
                >
                  Carregar outro ficheiro
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </GlobalModal>
  );
}
