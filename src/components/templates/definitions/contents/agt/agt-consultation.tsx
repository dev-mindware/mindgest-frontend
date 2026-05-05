"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Badge,
  Separator,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { agtService } from "@/services";
import { toast } from "sonner";
import { Search, FileSearch, CheckCircle2, XCircle, Info, Hash, Calendar, User, DollarSign } from "lucide-react";

export function AgtConsultation({ 
  externalDocNo, 
  clearExternalDocNo 
}: { 
  externalDocNo?: string; 
  clearExternalDocNo: () => void;
}) {
  const [documentNo, setDocumentNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [docResult, setDocResult] = useState<any>(null);

  const handleConsult = async (targetDocNo?: any) => {
    const finalDocNo = typeof targetDocNo === "string" ? targetDocNo : documentNo;
    if (!finalDocNo || typeof finalDocNo !== "string" || !finalDocNo.trim()) return;
    
    setIsLoading(true);
    setDocResult(null);
    try {
      const data = await agtService.consultInvoice(finalDocNo.trim());
      if (data && data.documentResult) {
        setDocResult(data.documentResult);
        toast.success("Documento encontrado no repositório AGT.");
      } else {
        toast.error("Documento não encontrado ou erro na resposta da AGT.");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao consultar documento.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (externalDocNo) {
      setDocumentNo(externalDocNo);
      handleConsult(externalDocNo);
      clearExternalDocNo();
    }
  }, [externalDocNo]);

  const handleValidate = async (action: "CONFIRMAR" | "REJEITAR") => {
    setIsValidating(true);
    try {
      await agtService.validateDocument({
        documentNo: docResult.documentNo,
        action: action
      });
      toast.success(`Documento ${action === "CONFIRMAR" ? "confirmado" : "rejeitado"} com sucesso!`);
      handleConsult(); // Refresh
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao validar documento.";
      toast.error(msg);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Consulta Direta AGT</h3>
        <p className="text-sm text-muted-foreground">
          Pesquise por um número de documento específico para verificar o seu estado ou validar faturas de fornecedores.
        </p>
      </div>

      <Card className="border-muted shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="doc-no" className="text-xs font-medium uppercase tracking-wider opacity-70">Número do Documento</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="doc-no"
                  placeholder="Ex: FT FT2026/123" 
                  className="h-10 pl-10 text-sm focus-visible:ring-primary/20" 
                  value={documentNo}
                  onChange={(e) => setDocumentNo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConsult()}
                />
              </div>
            </div>
            <Button onClick={() => handleConsult()} disabled={isLoading || !documentNo.trim()} className="h-10 px-8 gap-2">
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      {docResult && (
        <div className="grid gap-6 animate-in zoom-in-95 duration-300">
          <Card className="border-primary/20 shadow-md bg-primary/[0.02]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileSearch className="text-primary" size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">{docResult.documentNo}</CardTitle>
                    <CardDescription>Resultado da consulta em tempo-real</CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
                  {docResult.documentStatus === "N" ? "Válido / Normal" : docResult.documentStatus}
                </Badge>
              </div>
            </CardHeader>
            <Separator className="bg-primary/10" />
            <CardContent className="pt-6 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Data de Emissão</p>
                    <p className="text-sm font-medium">{docResult.documentDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Emitente (NIF)</p>
                    <p className="text-sm font-medium">{docResult.taxRegistrationNumber || "---"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Líquido</p>
                    <p className="text-lg font-bold text-primary">
                      {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(parseFloat(docResult.netTotal))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert variant="default" className="bg-blue-500/5 border-blue-500/20">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500 font-semibold text-sm">Ações de Conformidade</AlertTitle>
            <AlertDescription className="text-xs opacity-90">
              Se este documento for de um fornecedor, você deve confirmar ou rejeitar a sua validade para efeitos fiscais (Purchaser Validation).
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-4">
            <Button 
              variant="default" 
              className="bg-emerald-600 hover:bg-emerald-700 h-11 px-8 gap-2"
              onClick={() => handleValidate("CONFIRMAR")}
              disabled={isValidating}
            >
              <CheckCircle2 size={18} />
              Confirmar Documento
            </Button>
            <Button 
              variant="outline" 
              className="border-destructive text-destructive hover:bg-destructive/5 h-11 px-8 gap-2"
              onClick={() => handleValidate("REJEITAR")}
              disabled={isValidating}
            >
              <XCircle size={18} />
              Rejeitar Documento
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const RefreshCw = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);
