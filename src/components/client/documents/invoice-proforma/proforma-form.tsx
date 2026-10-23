"use client";
import { ErrorMessage } from "@/utils/messages";
import { useMemo, useCallback, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Icon,
  RHFSelect,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  NifVerificationField,
} from "@/components";
import { ProformaFormData, ProformaSchema } from "@/schemas";
import { useCreateProforma, useEditProforma, useInvoiceTotals, useNifFormVerification } from "@/hooks";
import { useClientSelection } from "@/hooks/invoice/use-invoice-client";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { currentStoreStore, useAuthStore, useModal } from "@/stores";
import { InvoiceItems } from "../document-forms/items";

import { paymentMethods } from "@/constants";
import { isSelectableClient } from "@/utils";
type Props = {
  action?: "create" | "edit";
  initialData?: any;
  id?: string;
  onSuccess?: () => void;
};

const WEEK = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export function ProformaForm({
  id,
  action = "create",
  initialData,
  onSuccess,
}: Props) {
  const { user } = useAuthStore();
  const isEdit = action === "edit";

  const { mutateAsync: createProforma, isPending: isPendingCreate } =
    useCreateProforma();
  const { mutateAsync: editProforma, isPending: isPendingEdit } =
    useEditProforma();
  const isLoading = isPendingCreate || isPendingEdit;

  const defaultValues = useMemo(() => {
    if (isEdit && initialData) {
      const subtotal = Number(initialData.subtotal || 0) || initialData.items?.reduce((acc: number, item: any) => {
        const price = Number(item.price || item.unitPrice || 0);
        const qty = Number(item.quantity || 1);
        return acc + price * qty;
      }, 0) || 0;

      const discountAmount = Number(initialData.discountAmount || 0);
      const discountPercent = subtotal > 0 ? Math.round((discountAmount / subtotal) * 100 * 100) / 100 : 0;

      const taxableBase = subtotal - discountAmount;
      const retentionAmount = Number(initialData.retentionAmount || 0);
      const retentionPercent = taxableBase > 0 ? Math.round((retentionAmount / taxableBase) * 100 * 10) / 10 : 0;

      return {
        issueDate:
          initialData.issueDate || new Date().toISOString().split("T")[0],
        proformaExpiresAt: WEEK,
        notes: initialData.notes || "",
        paymentMethod: initialData.paymentMethod || "CASH",
        clientId: initialData.client?.id || "",
        client: {
          name: initialData.client?.name || "",
          taxNumber: initialData.client?.taxNumber || "",
          address: initialData.client?.address || "",
          phone: initialData.client?.phone || "",
        },
        items:
          initialData.items?.map((item: any) => ({
            apiId: item.item?.id || item.itemsId || item.id,
            description: item.item?.name || item.description || item.name,
            unitPrice: Number(item.price || item.unitPrice || 0),
            quantity: Number(item.quantity || 1),
            type: item.item?.type || item.type || "PRODUCT",
            tax: Number(item.tax || item.taxRate || item.item?.tax?.rate || 0),
            taxId: item.taxId || item.item?.tax?.id || item.item?.taxId || item.tax?.id || "",
            isFromAPI: true,
          })) || [],
        globalRetention: retentionPercent,
        globalDiscount: discountPercent,
        currencyCode: (initialData.currencyCode as any) || "AOA",
        storeId: initialData.storeId || "",
      };
    }

    return {
      issueDate: new Date().toISOString().split("T")[0],
      proformaExpiresAt: WEEK,
      items: [],
      client: {
        name: "",
        taxNumber: "",
        address: "",
        phone: "",
      },
      globalRetention: 0,
      globalDiscount: 0,
      notes: "",
      currencyCode: "AOA" as const,
      paymentMethod: "CASH",
      storeId: "",
    };
  }, [isEdit, initialData]);

  const form = useForm<ProformaFormData>({
    resolver: zodResolver(ProformaSchema),
    mode: "onChange",
    defaultValues,
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    setError,
    clearErrors,
  } = form;

  const { handleClientChange, selectedClient, setSelectedClient } =
    useClientSelection(setValue);
  const { openModal } = useModal();
  const { currentStore } = currentStoreStore();
  const clientTaxNumber = watch("client.taxNumber") || "";
  const { handleStatusChange, handleVerified } = useNifFormVerification({
    setValue,
    setError,
    clearErrors,
    taxNumberField: "client.taxNumber",
    nameField: "client.name",
  });

  useEffect(() => {
    if (isEdit && initialData) {
      reset(defaultValues);
      if (initialData.client) {
        setSelectedClient({
          label: initialData.client.name,
          value: initialData.client.id,
          data: initialData.client,
        });
      }
    }
  }, [initialData, isEdit, reset, defaultValues, setSelectedClient]);

  const fieldArray = useFieldArray<ProformaFormData, "items">({
    control,
    name: "items",
  });

  const watchedValues = watch([
    "items",
    "globalRetention",
    "globalDiscount",
    "client.name",
    "clientId",
  ]);

  const [
    items,
    globalRetention,
    globalDiscount,
    clientName,
    clientId,
  ] = watchedValues;

  const totals = useInvoiceTotals({
    items: items ?? [],
    retention: globalRetention ?? 0,
    discount: globalDiscount ?? 0,
  });

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
    async (data: ProformaFormData) => {
      try {
        if (!data.items || data.items.length === 0) {
          ErrorMessage("Adicione pelo menos um item à proforma");
          return;
        }

        const clientPayload = data.clientId
          ? { id: data.clientId }
          : (!data.client?.name
            ? {
              name: "Consumidor Final",
              taxNumber: "999999999",
              address: currentStore?.address || "Loja",
            }
            : {
              name: data.client.name,
              phone: data.client.phone || undefined,
              address: data.client.address || undefined,
              taxNumber: data.client.taxNumber || undefined,
            });

        const itemsPayload = data.items.map((item) => {
          if (item.isFromAPI && item.apiId) {
            return {
              id: item.apiId,
              quantity: item.quantity,
              price: item.unitPrice,
              ...(item.taxId ? { taxId: item.taxId } : {}),
            };
          }
          return {
            name: item.description,
            price: item.unitPrice,
            quantity: item.quantity,
            type: item.type,
            ...(item.taxId ? { taxId: item.taxId } : {}),
          };
        });


        const finalPayload = {
          issueDate: data.issueDate,
          client: clientPayload,
          items: itemsPayload,
          total: totals.total,
          taxAmount: totals.taxAmount,
          retentionAmount: totals.retentionAmount,
          discountAmount: totals.discountAmount,
          subtotal: totals.subtotal,
          notes: data.notes || undefined,
          proformaExpiresAt: data.proformaExpiresAt,
          paymentMethod: data.paymentMethod,
          ...(!isEdit ? {
            currencyCode: data.currencyCode,
            ...(user?.role === "OWNER" &&
              currentStore?.id && { storeId: currentStore?.id }),
          } : {}),
        };



        if (isEdit && id) {
          await editProforma({ id, data: finalPayload as any });
        } else {
          const response = await createProforma(finalPayload as any);
          const invoiceId = response?.data?.id;

          if (invoiceId) {
            openModal("document-success", { id: invoiceId, type: "proforma" });
          }
        }

        if (onSuccess) {
          onSuccess();
        }

        if (!isEdit) {
          reset();
          setSelectedClient(null);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Ocorreu um erro ao criar a proforma. Tente novamente.";

        ErrorMessage(errorMessage);
      }
    },
    [
      isEdit,
      id,
      editProforma,
      createProforma,
      totals,
      reset,
      setSelectedClient,
      onSuccess,
      user?.role,
      currentStore?.address,
    ]
  );

  const handleClearForm = useCallback(() => {
    reset();
    setSelectedClient(null);
  }, [reset, setSelectedClient]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => console.log("Erro de Validação na Proforma:", errors))}
      className="p-4 sm:p-6 md:p-8 mt-4 space-y-6 sm:space-y-8 border rounded-lg bg-card shadow-xs"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Input
          type="date"
          label="Data de Emissão"
          {...register("issueDate")}
          error={errors.issueDate?.message}
          disabled
        />

        <Input
          type="date"
          label="Validade da Proforma"
          {...register("proformaExpiresAt")}
          error={errors.proformaExpiresAt?.message}
          disabled
        />

        <div
          data-tour={isEdit ? "proforma-edit-client" : undefined}
          className="sm:col-span-2 lg:col-span-1"
        >
          <AsyncCreatableSelectField
            endpoint="/clients"
            optionFilter={isSelectableClient}
            label={
              <span className="inline-flex items-center gap-1.5">
                Cliente (opcional)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Informação sobre o cliente da factura proforma"
                      className="inline-flex text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon name="CircleHelp" className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-64">
                    Se não seleccionar um cliente, a factura proforma será emitida
                    para Consumidor Final.
                  </TooltipContent>
                </Tooltip>
              </span>
            }
            placeholder="Digite o nome do cliente..."
            value={selectedClient}
            onChange={handleClientChange}
            displayFields={["name", "email"]}
            minChars={2}
            formatCreateLabel={(inputValue: string) => `➕ Criar "${inputValue}"`}
            error={errors.client?.name?.message}
          />
        </div>
        <input type="hidden" {...register("clientId")} />
        <input type="hidden" {...register("client.name")} />
      </div>

      {clientState.hasClient && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <NifVerificationField
            label="NIF"
            value={clientTaxNumber}
            onChange={(value) =>
              setValue("client.taxNumber", value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            onVerified={handleVerified}
            onStatusChange={handleStatusChange}
            verificationEnabled={clientState.isNewClient}
            error={errors.client?.taxNumber?.message}
            disabled={!clientState.isNewClient}
            placeholder="NIF"
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
            className="sm:col-span-2 md:col-span-1"
          />
        </div>
      )}

      <div data-tour={isEdit ? "proforma-edit-items" : undefined}>
        <InvoiceItems
          totals={totals}
          fieldArray={fieldArray}
          globalRetention={globalRetention ?? 0}
          setGlobalRetention={setGlobalRetention}
          globalDiscount={globalDiscount ?? 0}
          setGlobalDiscount={setGlobalDiscount}
        />
      </div>

      <div className="space-y-2" data-tour={isEdit ? "proforma-edit-notes" : undefined}>
        <Textarea
          {...register("notes")}
          placeholder="Adicione observações sobre esta proforma (opcional)"
          label="Observações"
          error={errors.notes?.message}
          rows={4}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-6 pt-6 border-t">
        {!isEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClearForm}
            disabled={isSubmitting || isLoading}
            className="w-full sm:w-auto"
          >
            Limpar Formulário
          </Button>
        )}

        {isEdit && (
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting || isLoading}
            onClick={onSuccess}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
        )}

        <span data-tour={isEdit ? "proforma-edit-submit" : undefined} className="w-full sm:w-auto">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full sm:w-auto min-w-[150px]"
          >
            {isLoading || isSubmitting
              ? "A processar..."
              : isEdit
                ? "Guardar alterações"
                : "Criar Proforma"}
          </Button>
        </span>
      </div>
    </form>
  );
}
