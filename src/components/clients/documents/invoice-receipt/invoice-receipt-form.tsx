"use client";
import { ErrorMessage } from "@/utils/messages";
import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  InvoiceFormSkeleton,
  RequestError,
  RHFSelect,
  Textarea,
} from "@/components";
import { InvoiceReceiptFormData, InvoiceReceiptSchema } from "@/schemas";
import { useCreateInvoiceReceipt, useInvoiceTotals } from "@/hooks";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { useClientSelection } from "@/hooks/invoice";
import { useGetStores } from "@/hooks/entities";
import { useAuthStore } from "@/stores";
import { paymentMethods } from "@/constants";
import { InvoiceItems } from "../document-forms/items";

export function InvoiceReceiptForm() {
  const { user } = useAuthStore();
  const { mutateAsync: createInvoiceReceipt, isPending } =
    useCreateInvoiceReceipt();
  const {
    stores,
    isLoading: loadingStores,
    error: storesError,
    refetch,
  } = useGetStores();

  const form = useForm<InvoiceReceiptFormData>({
    resolver: zodResolver(InvoiceReceiptSchema),
    mode: "onSubmit",
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      items: [],
      client: {
        name: "",
        taxNumber: "",
        address: "",
        phone: "",
      },
      globalTax: 0,
      globalRetention: 0,
      globalDiscount: 0,
      notes: "",
      paymentMethod: "CASH",
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

  const fieldArray = useFieldArray<InvoiceReceiptFormData, "items">({
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
    (v: number) =>
      setValue("globalTax", v, { shouldValidate: true, shouldDirty: true }),
    [setValue]
  );

  const setGlobalRetention = useCallback(
    (v: number) =>
      setValue("globalRetention", v, {
        shouldValidate: true,
        shouldDirty: true,
      }),
    [setValue]
  );

  const setGlobalDiscount = useCallback(
    (v: number) =>
      setValue("globalDiscount", v, {
        shouldValidate: true,
        shouldDirty: true,
      }),
    [setValue]
  );

  const clientState = useMemo(() => {
    const hasClient = Boolean(clientName);
    const isNewClient = hasClient && !clientId;
    return { hasClient, isNewClient };
  }, [clientName, clientId]);

  const onSubmit = useCallback(
    async (data: InvoiceReceiptFormData) => {
      try {
        if (!data.items || data.items.length === 0) {
          ErrorMessage("Adicione pelo menos um item à fatura recibo");
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
            return {
              id: item.id,
              quantity: item.quantity,
            };
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
          paymentMethod: data.paymentMethod,
          ...(user?.role === "OWNER" &&
            data.storeId && { storeId: data.storeId }),
        };

        await createInvoiceReceipt(finalPayload);

        reset();
        setSelectedClient(null);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Ocorreu um erro ao criar a fatura recibo. Tente novamente.";

        ErrorMessage(errorMessage);
      }
    },
    [createInvoiceReceipt, reset, setSelectedClient, totals, user?.role]
  );

  const handleClearForm = useCallback(() => {
    reset();
    setSelectedClient(null);
  }, [reset, setSelectedClient]);

  if (loadingStores && user?.role === "OWNER") return <InvoiceFormSkeleton />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 mt-4 space-y-8 border rounded-lg"
    >
      <div className="grid gap-6 md:grid-cols-2">
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
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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

        {user?.role === "OWNER" && (
          <div className="space-y-2">
            <RHFSelect
              label="Loja"
              control={control}
              options={stores ?? []}
              name="storeId"
              disabled={loadingStores}
            />
            {storesError && <RequestError refetch={refetch} />}
          </div>
        )}
      </div>

      {clientState.hasClient && (
        <div className="grid gap-6 md:grid-cols-3">
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

      <RHFSelect
        label="Método de pagamento"
        name="paymentMethod"
        control={control}
        options={paymentMethods}
      />

      <Textarea
        {...register("notes")}
        placeholder="Adicione observações sobre esta fatura recibo (opcional)"
        label="Observações"
        error={errors.notes?.message}
        rows={4}
      />

      <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleClearForm}
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
          {isPending || isSubmitting ? "Processando..." : "Criar Fatura Recibo"}
        </Button>
      </div>
    </form>
  );
}
