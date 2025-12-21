"use client";
import { toast } from "sonner";
import { useMemo, useCallback } from "react";
import { Button, Input } from "@/components";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProformaFormData, ProformaSchema } from "@/schemas";
import { InvoiceItems } from "./items/invoice-items";
import { useCreateProforma } from "@/hooks";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";

interface ClientSelectOption {
  value: string | number;
  label: string;
  data?: {
    id: string | number;
    name: string;
    taxNumber?: string;
    phone?: string;
    address?: string;
    email?: string;
  };
  __isNew__?: boolean;
}

export function ProformaForm() {
  const { mutateAsync: createProforma, isPending } = useCreateProforma();
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProformaFormData>({
    resolver: zodResolver(ProformaSchema) as any,
    mode: "onChange",
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
    },
  });

  const fieldArray = useFieldArray<ProformaFormData, "items">({
    control,
    name: "items",
  });

  const items = watch("items");
  const globalTax = watch("globalTax") || 0;
  const globalRetention = watch("globalRetention") || 0;
  const globalDiscount = watch("globalDiscount") || 0;

  const invoiceTotals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0),
      0
    );

    const taxAmount = subtotal * (globalTax / 100);
    const retentionAmount = subtotal * (globalRetention / 100);
    const discountAmount = subtotal * (globalDiscount / 100);
    const total = subtotal + taxAmount - retentionAmount - discountAmount;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      retentionAmount: Number(retentionAmount.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [items, globalTax, globalRetention, globalDiscount]);

  const handleClientChange = useCallback(
    (option: ClientSelectOption | null) => {
      if (!option) {
        // Limpa todos os campos de uma vez
        setValue("client", {
          name: "",
          taxNumber: "",
          address: "",
          phone: "",
        });
        return;
      }

      if (option.__isNew__) {
        setValue("client", {
          name: option.label,
          taxNumber: "",
          address: "",
          phone: "",
        });
      } else if (option.data) {
        // Cliente da API - preenche tudo de uma vez
        setValue("client", {
          name: option.data.name,
          taxNumber: option.data.taxNumber || "",
          address: option.data.address || "",
          phone: option.data.phone || "",
        });
        
        setValue("clientId", option.data.id as any);
      }
    },
    [setValue]
  );


  const onSubmit = useCallback(
    async (data: ProformaFormData) => {
      try {
        const clientPayload = (data as any).clientId
          ? { id: (data as any).clientId }
          : {
              name: data.client.name,
              phone: data.client.phone || undefined,
              address: data.client.address || undefined,
              taxNumber: data.client.taxNumber || undefined,
            };

        const finalPayload = {
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          client: clientPayload,
          items: data.items.map((item) => {
            // Se o item tem ID e veio da API, envia apenas ID e quantidade
            if (item.isFromAPI && item.id) {
              return {
                id: item.id,
                quantity: item.quantity,
              };
            }
            // Caso contrário, envia todos os dados
            return {
              name: item.description,
              price: item.unitPrice,
              quantity: item.quantity,
              type: item.type,
            };
          }),
          total: invoiceTotals.total,
          taxAmount: invoiceTotals.taxAmount,
          retentionAmount: invoiceTotals.retentionAmount,
          discountAmount: invoiceTotals.discountAmount,
        };

        console.log(finalPayload);
       // await createProforma(finalPayload);
       // toast.success("Proforma criada com sucesso!");

       // reset();
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Erro ao criar proforma";
        toast.error(errorMessage);
        console.error("Erro ao criar proforma:", error);
      }
    },
    [createProforma, invoiceTotals, reset]
  );

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const setGlobalTax = useCallback(
    (value: number) => setValue("globalTax", value),
    [setValue]
  );

  const setGlobalRetention = useCallback(
    (value: number) => setValue("globalRetention", value),
    [setValue]
  );

  const setGlobalDiscount = useCallback(
    (value: number) => setValue("globalDiscount", value),
    [setValue]
  );
  const clientName = watch("client.name");
  const hasClient = Boolean(clientName);
  
  const clientId = watch("clientId" as any);
  const isNewClient = hasClient && !clientId;

  return (
    <div className="p-8 mt-4 space-y-8 border rounded-lg">
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
        />

        <AsyncCreatableSelectField
          endpoint="/clients"
          label="Cliente"
          placeholder="Digite o nome do cliente..."
          value={
            clientName
              ? {
                  value: clientId || clientName,
                  label: clientName,
                  __isNew__: !clientId,
                }
              : null
          }
          onChange={handleClientChange}
          displayFields={["name", "email"]}
          minChars={2}
          formatCreateLabel={(inputValue: string) =>
            `➕ Criar "${inputValue}"`
          }
          error={errors.client?.name?.message}
        />
      </div>

      {hasClient && (
        <div className="grid gap-6 md:grid-cols-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Input
            label="NIF"
            placeholder="123456789"
            {...register("client.taxNumber")}
            error={errors.client?.taxNumber?.message}
            disabled={!isNewClient}
          />
          
          <Input
            startIcon="Phone"
            placeholder="923 456 789"
            label="Telefone do cliente"
            {...register("client.phone")}
            error={errors.client?.phone?.message}
            disabled={!isNewClient}
          />
          
          <Input
            startIcon="MapPin"
            placeholder="Luanda"
            label="Endereço do cliente"
            {...register("client.address")}
            error={errors.client?.address?.message}
            disabled={!isNewClient}
          />
        </div>
      )}

      <InvoiceItems
        globalTax={globalTax}
        fieldArray={fieldArray as any}
        setGlobalTax={setGlobalTax}
        globalRetention={globalRetention}
        setGlobalRetention={setGlobalRetention}
        globalDiscount={globalDiscount}
        setGlobalDiscount={setGlobalDiscount}
      />
      <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting || isPending}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || isPending}
          className="min-w-[200px]"
        >
          {isPending || isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Criando Proforma...
            </span>
          ) : (
            "Criar Proforma"
          )}
        </Button>
      </div>
    </div>
  );
}