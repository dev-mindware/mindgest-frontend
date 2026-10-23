"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Icon,
  SelectField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { useAuth } from "@/hooks/auth";
import {
  useIntegrationServices,
  useIntegrationTaxes,
  useSetServiceTax,
} from "@/hooks/plugins";
import type { IntegrationService, IntegrationTaxOption } from "@/types";
import { ErrorMessage, getApiErrorMessage } from "@/utils";

export function describeTax(tax: IntegrationService["tax"]) {
  if (!tax) return null;
  const rate = Number(tax.rate);
  if (rate > 0) return `${tax.name} (${rate}%)`;
  return tax.exemptionCode
    ? `${tax.name} · isento (${tax.exemptionCode})`
    : `${tax.name} · isento`;
}

function taxOptionLabel(t: IntegrationTaxOption) {
  return Number(t.rate) > 0
    ? `${t.name} (${Number(t.rate)}%)`
    : `${t.name} · isento${t.exemptionCode ? ` (${t.exemptionCode})` : ""}`;
}

interface Props {
  connectionId: string;
  schoolName: string;
  onBack: () => void;
}

export function MindschoolServices({
  connectionId,
  schoolName,
  onBack,
}: Props) {
  const { user } = useAuth();
  const canEdit = user?.role === "OWNER" || user?.role === "MANAGER";
  const { data: services = [], isLoading } =
    useIntegrationServices(connectionId);
  const { data: taxes = [] } = useIntegrationTaxes(canEdit);
  const { mutateAsync: setTax, isPending } = useSetServiceTax(connectionId);

  const missing = services.filter((s) => s.taxState === "POR_CONFIGURAR");
  const taxOptions = taxes.map((t) => ({
    value: t.id,
    label: taxOptionLabel(t),
  }));

  async function handleChange(serviceId: string, taxId: string) {
    try {
      await setTax({ serviceId, taxId });
    } catch (error) {
      ErrorMessage(
        getApiErrorMessage(error, "Não foi possível definir o imposto."),
      );
    }
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <Icon name="ArrowLeft" className="mr-1.5 h-4 w-4" />
          Plugins
        </Button>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Serviços do MindSchool</h3>
        <p className="text-sm text-muted-foreground">
          Cada emolumento de {schoolName} (propina, matrícula, multa…) chega
          aqui como um serviço. O imposto é definido por si, nunca pela escola.
        </p>
      </div>

      {missing.length > 0 && (
        <Alert>
          <Icon name="TriangleAlert" className="h-4 w-4" />
          <AlertTitle>
            {missing.length}{" "}
            {missing.length === 1 ? "serviço sem imposto" : "serviços sem imposto"}
          </AlertTitle>
          <AlertDescription>
            Sem imposto definido, a escola continua a registar pagamentos, mas
            a factura-recibo fica em espera e só é emitida depois de definir o
            imposto.
            {!canEdit && " Peça ao titular ou a um gestor para o definir."}
          </AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Preço de referência</TableHead>
            <TableHead>Imposto</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                A carregar serviços…
              </TableCell>
            </TableRow>
          )}
          {!isLoading && services.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                Ainda não chegou nenhum serviço. A escola envia o catálogo logo
                depois de a ligação ficar activa.
              </TableCell>
            </TableRow>
          )}
          {services.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-mono text-xs">{s.serviceRef}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.referencePrice ?? "—"}</TableCell>
              <TableCell>
                {canEdit ? (
                  <SelectField
                    label=""
                    className="min-w-56 [&>label]:hidden"
                    placeholder="Definir imposto"
                    value={s.tax?.id}
                    options={taxOptions}
                    onValueChange={(taxId) => handleChange(s.id, taxId)}
                  />
                ) : (
                  (describeTax(s.tax) ?? "—")
                )}
              </TableCell>
              <TableCell>
                {s.taxState === "PRONTO" ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    Pronto
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  >
                    Falta imposto
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isPending && (
        <p className="text-xs text-muted-foreground">A guardar…</p>
      )}
    </div>
  );
}
