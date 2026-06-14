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
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { agtService } from "@/services";
import { toast } from "sonner";
import { 
  Search, 
  FileSearch, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Hash, 
  Calendar, 
  User, 
  DollarSign, 
  ShieldCheck,
  RefreshCw
} from "lucide-react";

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
  
  // Validation parameters
  const [vatPercentage, setVatPercentage] = useState("100");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConsult = async (targetDocNo?: any) => {
    const finalDocNo = typeof targetDocNo === "string" ? targetDocNo : documentNo;
    if (!finalDocNo || typeof finalDocNo !== "string" || !finalDocNo.trim()) return;
    
    setIsLoading(true);
    setDocResult(null);
    try {
      const data = await agtService.consultInvoice(finalDocNo.trim());
      // The response structure might vary, let's look for statusResult or documentResult
      const result = data.statusResult || data;
      
      if (result && (result.documentNo || result.documentResult)) {
        setDocResult(result.documentResult || result);
        toast.success("Documento encontrado no repositório AGT.");
      } else if (data.errorList && data.errorList.length > 0) {
        toast.error(data.errorList[0].descriptionError || "Erro na consulta.");
      } else {
        toast.error("Documento não encontrado.");
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
      const params: any = {
        documentNo: docResult.documentNo,
        action: action
      };
      
      if (action === "CONFIRMAR") {
        params.deductibleVATPercentage = parseFloat(vatPercentage);
      }

      await agtService.validateDocument(params);
      toast.success(`Documento ${action === "CONFIRMAR" ? "confirmado" : "rejeitado"} com sucesso!`);
      handleConsult(); // Refresh state
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao validar documento.";
      toast.error(msg);
    } finally {
      setIsValidating(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <Card className="border-muted shadow-sm overflow-hidden">
        <div className="h-1 bg-primary/20" />
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary" />
            Consulta Direta de Documentos
          </CardTitle>
          <CardDescription>
            Pesquise pelo número do documento para validar facturas de fornecedores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Ex: FT FT2024/001" 
                className="h-11 pl-10 text-sm focus-visible:ring-primary/20" 
                value={documentNo}
                onChange={(e) => setDocumentNo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConsult()}
              />
            </div>
            <Button 
              onClick={() => handleConsult()} 
              disabled={isLoading || !documentNo.trim()} 
              className="h-11 px-8 gap-2 font-bold shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>
                  <Search size={18} />
                  Consultar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {docResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="md:col-span-2 border-muted shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-background text-primary border-primary/20 font-bold px-3 py-1">
                  {docResult.documentType || "DOCUMENTO"}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  {docResult.documentDate}
                </div>
              </div>
              <CardTitle className="mt-4 text-xl font-mono text-primary truncate">
                {docResult.documentNo}
              </CardTitle>
            </CardHeader>
            <Separator className="bg-muted/30" />
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Estado AGT</p>
                  <div className="flex items-center gap-2">
                    {docResult.documentStatus === "V" || docResult.documentStatus === "N" ? (
                      <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                        <CheckCircle2 size={16} />
                        Válido
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600">
                        <Info size={16} />
                        {docResult.documentStatusDescription || "Pendente / Registado"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Líquido</p>
                  <p className="text-lg font-bold text-foreground">
                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(parseFloat(docResult.netTotal) || 0)}
                  </p>
                </div>

                <div className="col-span-2 pt-4 border-t border-muted/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Emitente (NIF)</p>
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <User size={14} className="text-muted-foreground" />
                        {docResult.taxRegistrationNumber || "---"}
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">ID do Repositório</p>
                      <p className="text-xs font-medium text-foreground">{docResult.id || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-primary/20 shadow-sm bg-primary/[0.02]">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-tight text-primary flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Validação do Adquirente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConfirming ? (
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-10 gap-2 shadow-sm"
                      onClick={() => setIsConfirming(true)}
                      disabled={isValidating}
                    >
                      <CheckCircle2 size={16} />
                      Confirmar Factura
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-10 gap-2"
                      onClick={() => handleValidate("REJEITAR")}
                      disabled={isValidating}
                    >
                      {isValidating ? <RefreshCw size={16} className="animate-spin" /> : <XCircle size={16} />}
                      Rejeitar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-foreground">IVA Dedutível (%)</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          className="h-9 font-bold text-primary" 
                          value={vatPercentage}
                          onChange={(e) => setVatPercentage(e.target.value)}
                        />
                        <span className="text-sm font-bold text-muted-foreground">%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Indique a percentagem do IVA deste documento que pretende deduzir fiscalmente.
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 h-9 text-xs" 
                        onClick={() => setIsConfirming(false)}
                        disabled={isValidating}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 h-9 text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
                        onClick={() => handleValidate("CONFIRMAR")}
                        disabled={isValidating}
                      >
                        {isValidating ? <RefreshCw size={14} className="animate-spin" /> : "Validar"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="rounded-lg bg-muted/20 border border-muted p-4 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                <Info size={14} />
                Ajuda
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Ao confirmar um documento, declara à AGT que aceita a validade fiscal desta operação e o respectivo montante.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
