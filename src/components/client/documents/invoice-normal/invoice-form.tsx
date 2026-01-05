"use client";
import { ErrorMessage } from "@/utils/messages";
import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, InvoiceFormSkeleton, Textarea } from "@/components";
import { InvoiceFormData, InvoiceSchema } from "@/schemas";
import {
  useClientSelection,
  useCreateInvoice,
  useInvoiceTotals,
} from "@/hooks";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { useGetStores } from "@/hooks/entities";
import { currentStoreStore, useAuthStore } from "@/stores";
import { InvoiceItems } from "../document-forms/items";

export function InvoiceForm() {
  const { user } = useAuthStore();
  const { mutateAsync: createInvoiceNormal, isPending } = useCreateInvoice();
  const {
    stores,
    isLoading: loadingStores,
    error: storesError,
    refetch,
  } = useGetStores();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(InvoiceSchema),
    mode: "onSubmit",
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      items: [],
      globalTax: 0,
      globalRetention: 0,
      globalDiscount: 0,
      client: {
        name: "",
        phone: "",
        address: "",
        taxNumber: "",
      },
      notes: "",
      storeId: "",
    },
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = form;

  const { handleClientChange, selectedClient, setSelectedClient } =
    useClientSelection(setValue);
  const { currentStore } = currentStoreStore();

  const fieldArray = useFieldArray<InvoiceFormData, "items">({
    control,
    name: "items",
  });

  const watchedValues = watch([
    "items",
    "globalTax",
    "globalRetention",
    "globalDiscount",
    "client.name",
    "clientId",
  ]);

  const [
    items,
    globalTax,
    globalRetention,
    globalDiscount,
    clientName,
    clientId,
  ] = watchedValues;

  const totals = useInvoiceTotals({
    items: items ?? [],
    tax: globalTax ?? 0,
    retention: globalRetention ?? 0,
    discount: globalDiscount ?? 0,
  });

  const setGlobalTax = useCallback(
    (v: number) => setValue("globalTax", v, { shouldValidate: true }),
    [setValue]
  );

  const setGlobalRetention = useCallback(
    (v: number) => setValue("globalRetention", v, { shouldValidate: true }),
    [setValue]
  );

  const setGlobalDiscount = useCallback(
    (v: number) => setValue("globalDiscount", v, { shouldValidate: true }),
    [setValue]
  );

  const clientState = useMemo(() => {
    const hasClient = Boolean(clientName);
    const isNewClient = hasClient && !clientId;
    return { hasClient, isNewClient };
  }, [clientName, clientId]);

  const onSubmit = useCallback(
    async (data: InvoiceFormData) => {
      try {
        if (!data.items || data.items.length === 0) {
          ErrorMessage("Adicione pelo menos um item à fatura");
          return;
        }

        const clientPayload = data.clientId
          ? { id: data.clientId }
          : {
              name: data.client.name,
              phone: data.client.phone || undefined,
              address: data.client.address || undefined,
              taxNumber: data.client.taxNumber || undefined,
            };

        const itemsPayload = data.items.map((item) => {
          if (item.isFromAPI && item.id) {
            return { id: item.id, quantity: item.quantity };
          }
          return {
            name: item.description,
            price: item.unitPrice,
            quantity: item.quantity,
            type: item.type,
          };
        });

        const finalPayload = {
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          client: clientPayload,
          items: itemsPayload,
          total: totals.total,
          taxAmount: totals.taxAmount,
          retentionAmount: totals.retentionAmount,
          discountAmount: totals.discountAmount,
          subtotal: totals.subtotal,
          notes: data.notes || undefined,
          ...(user?.role === "OWNER" &&
            currentStore?.id && { storeId: currentStore?.id }),
        };

        await createInvoiceNormal(finalPayload);

        reset();
        setSelectedClient(null);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Ocorreu um erro ao criar a fatura. Tente novamente.";

        ErrorMessage(errorMessage);
      }
    },
    [createInvoiceNormal, reset, setSelectedClient, totals, user?.role]
  );

  if (loadingStores && user?.role === "OWNER") return <InvoiceFormSkeleton />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 mt-4 space-y-8 border rounded-lg"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Input
          type="date"
          label="Data de Emissão"
          {...register("issueDate")}
          error={errors.issueDate?.message}
          disabled
        />
        <Input
          type="date"
          label="Data de Vencimento"
          {...register("dueDate")}
          error={errors.dueDate?.message}
          required
        />
        

        <AsyncCreatableSelectField
          endpoint="/clients"
          label="Cliente"
          placeholder="Digite o nome do cliente..."
          value={selectedClient}
          onChange={handleClientChange}
          displayFields={["name", "email"]}
          minChars={2}
          formatCreateLabel={(inputValue: string) => `➕ Criar "${inputValue}"`}
          error={errors.client?.name?.message}
        />
      </div>

      {clientState.hasClient && (
        <div className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-300">
          <Input
            label="NIF"
            {...register("client.taxNumber")}
            error={errors.client?.taxNumber?.message}
            disabled={!clientState.isNewClient}
            placeholder="000000000"
          />
          <Input
            label="Telefone"
            {...register("client.phone")}
            error={errors.client?.phone?.message}
            disabled={!clientState.isNewClient}
            placeholder="9xxxxxxxx"
          />
          <Input
            label="Endereço"
            {...register("client.address")}
            error={errors.client?.address?.message}
            disabled={!clientState.isNewClient}
            placeholder="Luanda, Angola"
          />
        </div>
      )}

      <InvoiceItems
        totals={totals}
        fieldArray={fieldArray as any}
        setGlobalTax={setGlobalTax}
        globalTax={globalTax ?? 0}
        globalRetention={globalRetention ?? 0}
        setGlobalRetention={setGlobalRetention}
        globalDiscount={globalDiscount ?? 0}
        setGlobalDiscount={setGlobalDiscount}
      />

      <Textarea
        {...register("notes")}
        placeholder="Adicione observações sobre esta fatura (opcional)"
        label="Observações"
        error={errors.notes?.message}
        rows={4}
      />

      <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setSelectedClient(null);
          }}
          disabled={isSubmitting || isPending}
        >
          Limpar Formulário
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            isPending ||
            (user?.role === "OWNER" && loadingStores)
          }
          className="min-w-[150px]"
        >
          {isPending || isSubmitting ? "Processando..." : "Criar Fatura"}
        </Button>
      </div>
    </form>
  );
}
