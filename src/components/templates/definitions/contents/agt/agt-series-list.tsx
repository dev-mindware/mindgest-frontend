"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Separator,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { agtService } from "@/services";
import { toast } from "sonner";
import { Plus, ListFilter, RefreshCcw, LayoutGrid, Calendar, Hash } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface AgtSeries {
  id: string;
  seriesCode: string;
  documentType: string;
  seriesYear: string;
  establishmentNumber: string;
  currentSequence: number;
  lastDocumentNo: string | null;
  isActive: boolean;
  updatedAt: string;
}

export function AgtSeriesList() {
  const [series, setSeries] = useState<AgtSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [open, setOpen] = useState(false);

  // Form for new series
  const [newSeries, setNewSeries] = useState({
    documentType: "FT",
    seriesYear: new Date().getFullYear().toString(),
    establishmentNumber: "SEDE",
  });

  const fetchSeries = async () => {
    setIsLoading(true);
    try {
      const data = await agtService.getSeries();
      setSeries(data);
    } catch (error) {
      console.error("Failed to fetch AGT series:", error);
      toast.error("Erro ao carregar as séries da AGT.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleRequestSeries = async () => {
    setIsRequesting(true);
    try {
      await agtService.requestSeries(newSeries);
      toast.success("Nova série solicitada com sucesso!");
      setOpen(false);
      fetchSeries();
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao solicitar nova série.";
      toast.error(message);
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusBadge = (s: AgtSeries) => {
    if (!s.isActive) return <Badge variant="outline" className="text-xs opacity-50">Inativa</Badge>;
    
    // Check if exhausted (simplified)
    if (s.lastDocumentNo && s.currentSequence >= parseInt(s.lastDocumentNo)) {
      return <Badge variant="destructive" className="text-xs">Esgotada</Badge>;
    }
    
    return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">Ativa</Badge>;
  };

  const calculateProgress = (s: AgtSeries) => {
    if (!s.lastDocumentNo || s.lastDocumentNo === "999999999999") return 0;
    const last = parseInt(s.lastDocumentNo);
    if (isNaN(last) || last === 0) return 0;
    return Math.min((s.currentSequence / last) * 100, 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-medium">Gestão de Séries</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe a utilização das séries de numeração autorizadas pela AGT.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchSeries} disabled={isLoading} className="h-9 px-3">
            <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 flex gap-2">
                <Plus size={16} />
                Solicitar Série
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Série AGT</DialogTitle>
                <DialogDescription>
                  Solicite uma nova numeração oficial para os seus documentos.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-xs font-medium uppercase tracking-wider opacity-70">Tipo de Documento</Label>
                  <Select 
                    value={newSeries.documentType} 
                    onValueChange={(v) => setNewSeries({...newSeries, documentType: v})}
                  >
                    <SelectTrigger id="type" className="h-10 text-sm">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FT">Factura (FT)</SelectItem>
                      <SelectItem value="FR">Factura-Recibo (FR)</SelectItem>
                      <SelectItem value="VD">Venda a Dinheiro (VD)</SelectItem>
                      <SelectItem value="NC">Nota de Crédito (NC)</SelectItem>
                      <SelectItem value="ND">Nota de Débito (ND)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="year" className="text-xs font-medium uppercase tracking-wider opacity-70">Ano Fiscal</Label>
                    <Select 
                      value={newSeries.seriesYear} 
                      onValueChange={(v) => setNewSeries({...newSeries, seriesYear: v})}
                    >
                      <SelectTrigger id="year" className="h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="est" className="text-xs font-medium uppercase tracking-wider opacity-70">Estabelecimento</Label>
                    <Select 
                      value={newSeries.establishmentNumber} 
                      onValueChange={(v) => setNewSeries({...newSeries, establishmentNumber: v})}
                    >
                      <SelectTrigger id="est" className="h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEDE">Sede</SelectItem>
                        <SelectItem value="LOJA1">Loja 1</SelectItem>
                        <SelectItem value="LOJA2">Loja 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isRequesting} className="h-10">Cancelar</Button>
                <Button onClick={handleRequestSeries} disabled={isRequesting} className="h-10 min-w-[120px]">
                  {isRequesting ? "Solicitando..." : "Confirmar Pedido"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-muted shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[100px] text-[10px] uppercase font-bold text-muted-foreground py-3 px-4">Tipo</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3">Código / Ano</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3">Sequência</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3">Estado</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3 text-right pr-4">Consumo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse border-muted/50">
                    <TableCell colSpan={5} className="h-16 bg-muted/5" />
                  </TableRow>
                ))
              ) : series.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm italic">
                    Nenhuma série encontrada. Solicite a sua primeira série.
                  </TableCell>
                </TableRow>
              ) : (
                series.map((s) => (
                  <TableRow key={s.id} className="group hover:bg-muted/10 border-muted/50 transition-colors">
                    <TableCell className="px-4 py-4 font-bold text-primary">
                      {s.documentType}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{s.seriesCode}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar size={10} /> {s.seriesYear}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-[11px] h-6">
                          #{s.currentSequence}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">/ {s.lastDocumentNo === "999999999999" ? "∞" : s.lastDocumentNo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(s)}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000" 
                            style={{ width: `${calculateProgress(s)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {calculateProgress(s).toFixed(1)}% usado
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-500/5 border-blue-500/10">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2 text-blue-500">
              <LayoutGrid size={16} />
              <CardTitle className="text-xs uppercase tracking-wider">Total Ativas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-2xl font-bold">{series.filter(s => s.isActive).length}</span>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2 text-amber-500">
              <ListFilter size={16} />
              <CardTitle className="text-xs uppercase tracking-wider">Tipos Únicos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-2xl font-bold">{new Set(series.map(s => s.documentType)).size}</span>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/10">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <Hash size={16} />
              <CardTitle className="text-xs uppercase tracking-wider">Docs Emitidos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-2xl font-bold">
              {series.reduce((acc, s) => acc + s.currentSequence, 0).toLocaleString()}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
