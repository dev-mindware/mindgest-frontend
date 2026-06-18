"use client";

import { useEffect, useState } from "react";
import { Button, Icon } from "@/components";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { agtService, storesService } from "@/services";
import type { StoreResponse } from "@/types";
import { getApiErrorMessage } from "@/utils";
import { toast } from "sonner";

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
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoresLoading, setIsStoresLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [open, setOpen] = useState(false);
  const [newSeries, setNewSeries] = useState({
    documentType: "FT",
    seriesYear: new Date().getFullYear().toString(),
    storeId: "",
    establishmentNumber: "",
  });

  const fetchSeries = async () => {
    setIsLoading(true);
    try {
      const data = await agtService.getSeries();
      setSeries(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao carregar as séries da AGT."));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStores = async () => {
    setIsStoresLoading(true);
    try {
      const response = await storesService.getStores();
      setStores(response.data?.data || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao carregar as lojas para solicitar AGT."));
    } finally {
      setIsStoresLoading(false);
    }
  };

  useEffect(() => {
    void fetchSeries();
    void fetchStores();
  }, []);

  const handleRequestSeries = async () => {
    setIsRequesting(true);
    try {
      await agtService.requestSeries({
        documentType: newSeries.documentType,
        seriesYear: newSeries.seriesYear,
        storeId: newSeries.storeId || undefined,
        establishmentNumber: newSeries.establishmentNumber || undefined,
      });
      toast.success("Nova série solicitada com sucesso.");
      setOpen(false);
      void fetchSeries();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao solicitar nova série."));
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusBadge = (currentSeries: AgtSeries) => {
    if (!currentSeries.isActive) {
      return <Badge variant="outline">Inativa</Badge>;
    }

    if (
      currentSeries.lastDocumentNo &&
      currentSeries.currentSequence >= Number.parseInt(currentSeries.lastDocumentNo, 10)
    ) {
      return <Badge variant="destructive">Esgotada</Badge>;
    }

    return <Badge variant="secondary">Activa</Badge>;
  };

  const calculateProgress = (currentSeries: AgtSeries) => {
    if (!currentSeries.lastDocumentNo || currentSeries.lastDocumentNo === "999999999999") {
      return 0;
    }

    const lastDocumentNo = Number.parseInt(currentSeries.lastDocumentNo, 10);
    if (Number.isNaN(lastDocumentNo) || lastDocumentNo === 0) return 0;
    return Math.min((currentSeries.currentSequence / lastDocumentNo) * 100, 100);
  };

  const activeSeries = series.filter((item) => item.isActive).length;
  const documentTypes = new Set(series.map((item) => item.documentType)).size;
  const issuedDocuments = series.reduce(
    (total, item) => total + item.currentSequence,
    0,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Séries fiscais</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe a utilização das séries de numeração autorizadas pela AGT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void fetchSeries()}
            disabled={isLoading}
            aria-label="Actualizar séries"
          >
            <Icon
              name="RefreshCcw"
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" size="sm" className="gap-2">
                <Icon name="Plus" className="h-4 w-4" />
                Solicitar série
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px]">
              <DialogHeader>
                <DialogTitle>Nova série AGT</DialogTitle>
                <DialogDescription>
                  Solicite uma numeração oficial para documentos fiscais.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="agt-series-type">Tipo de documento</Label>
                  <Select
                    value={newSeries.documentType}
                    onValueChange={(documentType) =>
                      setNewSeries({ ...newSeries, documentType })
                    }
                  >
                    <SelectTrigger id="agt-series-type">
                      <SelectValue placeholder="Seleccione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FT">Factura (FT)</SelectItem>
                      <SelectItem value="FR">Factura-recibo (FR)</SelectItem>
                      <SelectItem value="RC">Recibo (RC)</SelectItem>
                      <SelectItem value="NC">Nota de crédito (NC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="agt-series-year">Ano fiscal</Label>
                    <Input
                      id="agt-series-year"
                      value={newSeries.seriesYear}
                      disabled
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="agt-series-store">Loja</Label>
                    <Select
                      value={newSeries.storeId}
                      onValueChange={(value) => {
                        const selectedStore = stores.find((store) => store.id === value);
                        setNewSeries({
                          ...newSeries,
                          storeId: value,
                          establishmentNumber: selectedStore?.code || "SEDE",
                        });
                      }}
                    >
                      <SelectTrigger id="agt-series-store">
                        <SelectValue
                          placeholder={
                            isStoresLoading ? "A carregar lojas..." : "Seleccionar loja"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {`${store.code || "SEDE"} - ${store.name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="agt-series-establishment">
                    Código do estabelecimento
                  </Label>
                  <Input
                    id="agt-series-establishment"
                    value={newSeries.establishmentNumber}
                    onChange={(event) =>
                      setNewSeries({
                        ...newSeries,
                        establishmentNumber: event.target.value.toUpperCase(),
                      })
                    }
                    maxLength={20}
                    placeholder="Ex: SEDE"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use o código configurado na loja ou informe manualmente.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isRequesting}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleRequestSeries}
                  disabled={
                    isRequesting ||
                    isStoresLoading ||
                    (!newSeries.storeId && !newSeries.establishmentNumber)
                  }
                >
                  {isRequesting ? "A solicitar..." : "Confirmar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Séries activas" value={activeSeries.toString()} />
        <Metric label="Tipos de documento" value={documentTypes.toString()} />
        <Metric label="Documentos emitidos" value={issuedDocuments.toLocaleString()} />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Código / ano</TableHead>
              <TableHead>Sequência</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Consumo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5} className="h-14 text-muted-foreground">
                    A carregar séries...
                  </TableCell>
                </TableRow>
              ))
            ) : series.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                  Nenhuma série encontrada.
                </TableCell>
              </TableRow>
            ) : (
              series.map((item) => {
                const progress = calculateProgress(item);

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.documentType}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium">{item.seriesCode}</p>
                        <p className="text-xs text-muted-foreground">{item.seriesYear}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {item.currentSequence}
                      </span>
                      <span className="text-muted-foreground">
                        {" / "}
                        {item.lastDocumentNo === "999999999999"
                          ? "sem limite"
                          : item.lastDocumentNo || "-"}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(item)}</TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto flex max-w-32 flex-col items-end gap-1.5">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
