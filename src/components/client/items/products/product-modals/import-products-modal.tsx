"use client";

import { useCallback, useEffect, useState } from "react";
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
    description: "Modelo essencial para cadastro rápido de produtos e stock inicial com impostos.",
    fields: [
      { name: "Nome", required: true },
      { name: "Preço de Venda", required: true },
      { name: "Código do Imposto", required: true },
      { name: "Stock Inicial" },
      { name: "Preço de Custo" },
      { name: "Categoria" },
      { name: "Descrição" },
    ],
    hint: "Consulte a aba 'Tabela de Impostos' no Excel para ver os códigos (ex: IVA14, M10). Código de Barras e SKU requerem Plano Smart.",
  },
  Smart: {
    label: "Plano Smart",
    description: "Modelo completo com suporte a impostos, leitores de código de barras e alertas de stock.",
    fields: [
      { name: "Nome", required: true },
      { name: "Preço de Venda", required: true },
      { name: "Código do Imposto", required: true },
      { name: "Stock Inicial" },
      { name: "Preço de Custo" },
      { name: "Código de Barras" },
      { name: "SKU" },
      { name: "Stock Mínimo" },
      { name: "Categoria" },
      { name: "Descrição" },
    ],
    hint: "Consulte a aba 'Tabela de Impostos' no Excel para ver os códigos. Unidade e Validade requerem Plano Pro.",
  },
  Pro: {
    label: "Plano Pro",
    description: "Modelo empresarial com gestão total de catálogo, impostos, logística e controlo de validade.",
    fields: [
      { name: "Nome", required: true },
      { name: "Preço de Venda", required: true },
      { name: "Código do Imposto", required: true },
      { name: "Stock Inicial" },
      { name: "Preço de Custo" },
      { name: "Código de Barras" },
      { name: "SKU" },
      { name: "Stock Mínimo" },
      { name: "Categoria" },
      { name: "Unidade" },
      { name: "Validade (AAAA-MM-DD)" },
      { name: "Descrição" },
    ],
    hint: "O ficheiro inclui as abas 'Produtos', 'Tabela de Impostos' e 'Regras e Instruções'.",
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

  const isOpen = !!open[IMPORT_PRODUCTS_MODAL_ID];

  function reset() {
    setFile(null);
    setResult(null);
  }

  function handleClose() {
    reset();
    closeModal(IMPORT_PRODUCTS_MODAL_ID);
  }

  // Reseta estado do upload sempre que o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const done = !!result && !result.dryRun;
  const canConfirm = !!result && result.dryRun && result.created > 0 && !isPending;

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
      className="w-full sm:max-w-3xl border-border shadow-lg"
      title={
        <div className="flex items-center justify-between w-full pr-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground tracking-tight leading-none">
                Importar Stock em Massa
              </h2>
              <p className="text-xs text-muted-foreground font-normal mt-1">
                Adicione produtos e stock inicial via folha de cálculo Excel (.xlsx)
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary font-semibold text-xs py-0.5 px-2.5"
          >
            {planInfo.label}
          </Badge>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
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
                className="w-full sm:w-auto shadow-xs"
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
                className="w-full sm:w-auto shadow-xs font-semibold"
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
          <div className="rounded-xl border border-border bg-muted/40 p-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Modelo Adaptado ao seu Plano ({currentPlan})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {planInfo.description}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                loading={isDownloading}
                className="shrink-0"
              >
                <Download className="mr-1.5 h-4 w-4 text-primary" />
                Descarregar Modelo (.xlsx)
              </Button>
            </div>

            {/* CHIPS DOS CAMPOS DISPONÍVEIS */}
            <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-muted-foreground" />
                Campos no modelo:
              </span>
              {planInfo.fields.map((f) => (
                <span
                  key={f.name}
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium border",
                    f.required
                      ? "bg-primary/10 text-primary border-primary/25 font-semibold"
                      : "bg-card text-muted-foreground border-border"
                  )}
                >
                  {f.name}
                  {f.required && <span className="ml-0.5 text-primary">*</span>}
                </span>
              ))}
            </div>

            {planInfo.hint && (
              <p className="mt-2 text-[11px] text-muted-foreground italic">
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
                  "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer group",
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
                  isDragReject && "border-destructive/60 bg-destructive/10"
                )}
              >
                <input {...getInputProps()} />
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 shadow-xs flex items-center justify-center text-primary group-hover:scale-105 transition-transform mb-2">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Arraste o seu ficheiro Excel aqui, ou{" "}
                  <span className="text-primary underline underline-offset-2">
                    procure no computador
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Apenas ficheiros no formato .xlsx (máximo de 1.000 linhas • até 5MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 leading-none">
                    {result.created}
                  </div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                    {result.dryRun ? "Prontos para Gravar" : "Criados com Sucesso"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 leading-none">
                    {result.skipped}
                  </div>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-1">
                    Ignorados (Duplicados)
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive shrink-0">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-destructive leading-none">
                    {result.failed}
                  </div>
                  <p className="text-xs font-semibold text-destructive mt-1">
                    Linhas com Erro
                  </p>
                </div>
              </div>
            </div>

            {/* TABELA DE PROBLEMAS / DUPLICADOS */}
            {problems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Avisos e Erros Detectados ({problems.length})</span>
                  <span className="text-muted-foreground font-normal">
                    Linhas duplicadas ou inválidas não serão gravadas
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-card text-xs shadow-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-muted/80 backdrop-blur-xs border-b border-border text-foreground font-semibold">
                      <tr>
                        <th className="p-2.5 w-16">Linha</th>
                        <th className="p-2.5 w-44">Produto</th>
                        <th className="p-2.5 w-24">Estado</th>
                        <th className="p-2.5">Motivo detalhado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {problems.map((r) => {
                        const statusCfg = STATUS_CONFIG[r.status];
                        return (
                          <tr key={r.row} className="hover:bg-muted/40 transition-colors">
                            <td className="p-2.5 font-mono font-medium text-muted-foreground">
                              #{r.row}
                            </td>
                            <td className="p-2.5 font-medium text-foreground truncate max-w-[180px]">
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
                            <td className="p-2.5 text-muted-foreground leading-relaxed">
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
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Nenhum produto válido para importação.</p>
                  <p className="mt-0.5 text-muted-foreground">
                    Corrija os erros assinalados no seu ficheiro Excel e efectue uma nova validação.
                  </p>
                </div>
              </div>
            )}

            {/* SE SUCESSO DEFINITIVO */}
            {done && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-foreground">
                  Processo de Importação Concluído!
                </h4>
                <p className="text-xs text-muted-foreground">
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
                  className="text-xs text-muted-foreground hover:text-foreground"
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
