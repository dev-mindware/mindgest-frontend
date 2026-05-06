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
  Input,
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
import { Search, FileText, Calendar, RefreshCw, Eye, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AgtInvoice {
  id: string;
  type: string;
  number: string;
  date: string;
  status: string;
  statusDescription: string;
  total: number;
}

export function AgtInvoiceList({ onConsult }: { onConsult: (docNo: string) => void }) {
  const [invoices, setInvoices] = useState<AgtInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [filters, setFilters] = useState({
    queryStartDate: format(new Date(new Date().setDate(new Date().getDate() - 30)), "yyyy-MM-dd"),
    queryEndDate: format(new Date(), "yyyy-MM-dd"),
    documentType: "ALL",
  });

  const fetchInvoices = async (currentPage: number = 1) => {
    setIsLoading(true);
    try {
      const params: any = {
        queryStartDate: filters.queryStartDate,
        queryEndDate: filters.queryEndDate,
        page: currentPage,
        limit: limit,
      };
      if (filters.documentType !== "ALL") {
        params.documentType = filters.documentType;
      }

      const data = await agtService.listInvoices(params);
      setInvoices(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      console.error("Failed to fetch AGT invoices:", error);
      toast.error("Erro ao carregar as faturas da AGT.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(1);
  }, []);

  const handleFilter = () => {
    fetchInvoices(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchInvoices(newPage);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "N":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Normal</Badge>;
      case "A":
        return <Badge variant="destructive" className="text-[10px]">Anulada</Badge>;
      case "S":
        return <Badge variant="outline" className="text-[10px]">Substituída</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-medium">Repositório AGT</h3>
          <p className="text-sm text-muted-foreground">
            Consulte os documentos registados diretamente na base de dados da AGT.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchInvoices(page)} disabled={isLoading} className="h-9 px-3">
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      <Card className="border-muted shadow-sm">
        <CardHeader className="pb-4 bg-muted/20">
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid gap-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Data Início</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="h-9 w-[160px] pl-9 text-xs focus-visible:ring-primary/20" 
                  value={filters.queryStartDate}
                  onChange={(e) => setFilters({...filters, queryStartDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Data Fim</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="h-9 w-[160px] pl-9 text-xs focus-visible:ring-primary/20" 
                  value={filters.queryEndDate}
                  onChange={(e) => setFilters({...filters, queryEndDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Tipo</Label>
              <Select 
                value={filters.documentType} 
                onValueChange={(v) => setFilters({...filters, documentType: v})}
              >
                <SelectTrigger className="h-9 w-[140px] text-xs focus:ring-primary/20">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="FT">Factura (FT)</SelectItem>
                  <SelectItem value="FR">Factura-Recibo (FR)</SelectItem>
                  <SelectItem value="NC">Nota de Crédito (NC)</SelectItem>
                  <SelectItem value="RG">Recibo (RG)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="h-9 px-4 gap-2 text-xs" onClick={handleFilter} disabled={isLoading}>
              <Search size={14} />
              Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[10px] uppercase font-bold py-3 px-4 w-[120px]">Tipo</TableHead>
                <TableHead className="text-[10px] uppercase font-bold py-3">Número do Documento</TableHead>
                <TableHead className="text-[10px] uppercase font-bold py-3 w-[120px]">Data</TableHead>
                <TableHead className="text-[10px] uppercase font-bold py-3 w-[100px]">Estado</TableHead>
                <TableHead className="text-[10px] uppercase font-bold py-3 text-right pr-4">Total Líquido</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={6} className="h-14 bg-muted/5" />
                  </TableRow>
                ))
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground text-sm italic">
                    Nenhum documento encontrado para este período.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((inv) => (
                  <TableRow key={inv.id} className="group hover:bg-muted/10 border-muted/50 transition-colors">
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-primary/5 flex items-center justify-center">
                          <FileText size={14} className="text-primary" />
                        </div>
                        <span className="text-xs font-bold text-primary">{inv.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono font-medium text-foreground tracking-tight">
                        {inv.number}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground font-medium">
                        {inv.date}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inv.status)}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <span className="text-xs font-bold text-foreground">
                        {formatCurrency(inv.total)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onConsult(inv.number)}
                      >
                        <Eye size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-2">
        <p className="text-[11px] text-muted-foreground">
          Mostrando <span className="font-bold text-foreground">{invoices.length}</span> de <span className="font-bold text-foreground">{total}</span> documentos encontrados.
          {totalPages > 1 && (
            <span className="ml-2">
              Página <span className="font-bold text-foreground">{page}</span> de <span className="font-bold text-foreground">{totalPages}</span>
            </span>
          )}
        </p>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[11px]" 
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isLoading}
          >
            Anterior
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[11px]" 
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
