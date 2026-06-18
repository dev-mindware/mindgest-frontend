"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button, Icon } from "@/components";
import {
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { agtService } from "@/services";
import { getApiErrorMessage } from "@/utils";
import { toast } from "sonner";

interface AgtInvoice {
  id: string;
  type: string;
  number: string;
  date: string;
  status: string;
  statusDescription: string;
  total: number;
}

export function AgtInvoiceList({
  onConsult,
}: {
  onConsult: (docNo: string) => void;
}) {
  const [invoices, setInvoices] = useState<AgtInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    queryStartDate: format(
      new Date(new Date().setDate(new Date().getDate() - 30)),
      "yyyy-MM-dd",
    ),
    queryEndDate: format(new Date(), "yyyy-MM-dd"),
    documentType: "ALL",
  });

  const fetchInvoices = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const params: {
        queryStartDate: string;
        queryEndDate: string;
        documentType?: string;
        page: number;
        limit: number;
      } = {
        queryStartDate: filters.queryStartDate,
        queryEndDate: filters.queryEndDate,
        page: currentPage,
        limit,
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
      toast.error(getApiErrorMessage(error, "Erro ao carregar as facturas da AGT."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchInvoices(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    void fetchInvoices(newPage);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "N":
        return <Badge variant="secondary">Normal</Badge>;
      case "A":
        return <Badge variant="destructive">Anulada</Badge>;
      case "S":
        return <Badge variant="outline">Substituída</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Repositório AGT</h3>
          <p className="text-sm text-muted-foreground">
            Consulte os documentos registados na base de dados da AGT.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void fetchInvoices(page)}
          disabled={isLoading}
          aria-label="Actualizar documentos"
        >
          <Icon
            name="RefreshCw"
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <div className="rounded-md border bg-background p-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_160px_auto] lg:items-end">
          <div className="grid gap-2">
            <Label htmlFor="agt-start-date">Data inicial</Label>
            <Input
              id="agt-start-date"
              type="date"
              value={filters.queryStartDate}
              onChange={(event) =>
                setFilters({ ...filters, queryStartDate: event.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="agt-end-date">Data final</Label>
            <Input
              id="agt-end-date"
              type="date"
              value={filters.queryEndDate}
              onChange={(event) =>
                setFilters({ ...filters, queryEndDate: event.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Select
              value={filters.documentType}
              onValueChange={(documentType) =>
                setFilters({ ...filters, documentType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="FT">Factura (FT)</SelectItem>
                <SelectItem value="FR">Factura-recibo (FR)</SelectItem>
                <SelectItem value="NC">Nota de crédito (NC)</SelectItem>
                <SelectItem value="RG">Recibo (RG)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            className="gap-2"
            onClick={() => void fetchInvoices(1)}
            disabled={isLoading}
          >
            <Icon name="Search" className="h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total líquido</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6} className="h-12 text-muted-foreground">
                    A carregar documentos...
                  </TableCell>
                </TableRow>
              ))
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                  Nenhum documento encontrado para este período.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.type}</TableCell>
                  <TableCell className="font-mono text-sm">{invoice.number}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onConsult(invoice.number)}
                      aria-label="Consultar documento"
                    >
                      <Icon name="Eye" className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {invoices.length} de {total} documentos.
          {totalPages > 1 && ` Página ${page} de ${totalPages}.`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isLoading}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
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
