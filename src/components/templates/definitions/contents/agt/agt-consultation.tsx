"use client";

import { useEffect, useState } from "react";
import { Button, Icon } from "@/components";
import {
  Badge,
  Input,
  Label,
  Separator,
} from "@/components/ui";
import { agtService } from "@/services";
import { toast } from "sonner";

export function AgtConsultation({
  externalDocNo,
  clearExternalDocNo,
}: {
  externalDocNo?: string;
  clearExternalDocNo: () => void;
}) {
  const [documentNo, setDocumentNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [docResult, setDocResult] = useState<any>(null);
  const [vatPercentage, setVatPercentage] = useState("100");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConsult = async (targetDocNo?: unknown) => {
    const finalDocNo = typeof targetDocNo === "string" ? targetDocNo : documentNo;
    if (!finalDocNo.trim()) return;

    setIsLoading(true);
    setDocResult(null);
    try {
      const data = await agtService.consultInvoice(finalDocNo.trim());
      const result = data.statusResult || data;

      if (result && (result.documentNo || result.documentResult)) {
        setDocResult(result.documentResult || result);
        toast.success("Documento encontrado no repositório AGT.");
      } else if (data.errorList?.length > 0) {
        toast.error(data.errorList[0].descriptionError || "Erro na consulta.");
      } else {
        toast.error("Documento não encontrado.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao consultar documento.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!externalDocNo) return;

    setDocumentNo(externalDocNo);
    void handleConsult(externalDocNo);
    clearExternalDocNo();
  }, [externalDocNo]);

  const handleValidate = async (action: "CONFIRMAR" | "REJEITAR") => {
    setIsValidating(true);
    try {
      const params: any = {
        documentNo: docResult.documentNo,
        action,
      };

      if (action === "CONFIRMAR") {
        params.deductibleVATPercentage = Number.parseFloat(vatPercentage);
      }

      await agtService.validateDocument(params);
      toast.success(
        `Documento ${action === "CONFIRMAR" ? "confirmado" : "rejeitado"} com sucesso.`,
      );
      void handleConsult();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao validar documento.");
    } finally {
      setIsValidating(false);
      setIsConfirming(false);
    }
  };

  const isValidDocument =
    docResult?.documentStatus === "V" || docResult?.documentStatus === "N";

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Consulta e validação</h3>
        <p className="text-sm text-muted-foreground">
          Pesquise documentos no repositório fiscal e valide facturas de fornecedores.
        </p>
      </div>

      <div className="rounded-md border bg-background p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="agt-document-no">Número do documento</Label>
            <Input
              id="agt-document-no"
              placeholder="Ex: FT FT2024/001"
              value={documentNo}
              onChange={(event) => setDocumentNo(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && void handleConsult()}
            />
          </div>

          <Button
            type="button"
            className="gap-2"
            onClick={() => void handleConsult()}
            disabled={isLoading || !documentNo.trim()}
          >
            {isLoading ? (
              <Icon name="RefreshCw" className="h-4 w-4 animate-spin" />
            ) : (
              <Icon name="Search" className="h-4 w-4" />
            )}
            Consultar
          </Button>
        </div>
      </div>

      {docResult && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-md border bg-background">
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {docResult.documentType || "Documento"}
                  </Badge>
                  <Badge variant={isValidDocument ? "secondary" : "outline"}>
                    {isValidDocument
                      ? "Válido"
                      : docResult.documentStatusDescription || "Pendente"}
                  </Badge>
                </div>
                <h4 className="truncate font-mono text-lg font-semibold">
                  {docResult.documentNo}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {docResult.documentDate || "Sem data informada"}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-muted-foreground">Total líquido</p>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                  }).format(Number.parseFloat(docResult.netTotal) || 0)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <InfoItem
                label="Emitente (NIF)"
                value={docResult.taxRegistrationNumber || "-"}
              />
              <InfoItem label="ID do repositório" value={docResult.id || "-"} />
              <InfoItem
                label="Estado fiscal"
                value={docResult.documentStatusDescription || docResult.documentStatus || "-"}
              />
              <InfoItem
                label="Tipo de documento"
                value={docResult.documentType || "-"}
              />
            </div>
          </div>

          <div className="rounded-md border bg-background p-4">
            <div className="space-y-1">
              <h4 className="font-semibold">Validação do adquirente</h4>
              <p className="text-sm text-muted-foreground">
                Confirme ou rejeite o documento consultado junto da AGT.
              </p>
            </div>

            <Separator className="my-4" />

            {!isConfirming ? (
              <div className="grid gap-2">
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => setIsConfirming(true)}
                  disabled={isValidating}
                >
                  <Icon name="CircleCheck" className="h-4 w-4" />
                  Confirmar factura
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => void handleValidate("REJEITAR")}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <Icon name="RefreshCw" className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon name="CircleX" className="h-4 w-4" />
                  )}
                  Rejeitar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="agt-vat-percentage">IVA dedutível (%)</Label>
                  <Input
                    id="agt-vat-percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={vatPercentage}
                    onChange={(event) => setVatPercentage(event.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Indique a percentagem do IVA que pretende deduzir fiscalmente.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsConfirming(false)}
                    disabled={isValidating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => void handleValidate("CONFIRMAR")}
                    disabled={isValidating}
                  >
                    {isValidating ? "A validar..." : "Validar"}
                  </Button>
                </div>
              </div>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              Ao confirmar um documento, declara à AGT que aceita a validade fiscal desta operação.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium">{value}</p>
    </div>
  );
}
