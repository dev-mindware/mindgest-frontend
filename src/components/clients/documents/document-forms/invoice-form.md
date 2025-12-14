"use client";
import { toast } from "sonner";
import { ButtonSubmit, Input } from "@/components";
import {
useForm,
useFieldArray,
useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceFormData, InvoiceSchema } from "@/schemas";
import { InvoiceItems } from "./items/invoice-items";
import { InputFetch } from "@/components/common/input-fetch";
import { invoiceService } from "@/services/invoice-service";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function InvoiceForm() {
const router = useRouter();
const [isClientFromAPI, setIsClientFromAPI] = useState(false);
const {
register,
control,
setValue,
handleSubmit,
formState: { errors, isSubmitting },
reset,
} = useForm<InvoiceFormData>({
resolver: zodResolver(InvoiceSchema),
mode: "onChange",
defaultValues: {
// Valores padrão para campos obrigatórios
issueDate: "",
dueDate: "",
client: {
name: "",
address: "",
taxNumber: "",
phone: "",
email: "",
},
items: [],
isPaid: false,
globalTax: 0,
globalRetention: 0,
globalDiscount: 0,
invoiceTotals: {
subtotal: 0,
taxAmount: 0,
retentionAmount: 0,
discountAmount: 0,
total: 0,
},

},
});

const fieldArray = useFieldArray<InvoiceFormData, "items">({
control: control as any,
name: "items",
});

const globalTax = useWatch({ control, name: "globalTax" });
const globalRetention = useWatch({ control, name: "globalRetention" });
const globalDiscount = useWatch({ control, name: "globalDiscount" });
const clientApiId = useWatch({ control, name: "clientApiId" });
const invoiceTotals = useWatch({ control, name: "invoiceTotals" });

/_
clientApiId: z.string().optional(),
isClientFromAPI: z.boolean().default(false),
globalTax: z.number().optional().default(0),
globalRetention: z.number().optional().default(0),
globalDiscount: z.number().optional().default(0),
invoiceTotals: InvoiceTotalsSchema, _/

const handleClientChange = (id: string | number, fullObject: any | null) => {
if (fullObject && fullObject.name) {
// Client from API
setValue("client.name", fullObject.name);
setValue("client.taxNumber", fullObject.taxNumber || "");
setValue("client.address", fullObject.address || "");
setValue("client.phone", fullObject.phone || "");
setValue("clientApiId", fullObject.id);
setIsClientFromAPI(true);
} else {
// Manual entry
setValue("client.name", typeof id === "string" ? id : "");
setValue("client.taxNumber", "");
setValue("client.address", "");
setValue("client.phone", "");
setValue("clientApiId", undefined);
setIsClientFromAPI(false);
}
};

async function onSubmit(data: InvoiceFormData) {
// Construct final payload
const finalPayload = {
issueDate: data.issueDate,
dueDate: data.dueDate,
client:
isClientFromAPI && data.clientApiId
? { id: data.clientApiId }
: {
name: data.client.name,
phone: data.client.phone || undefined,
address: data.client.address || undefined,
},
items: data.items.map((item) => {
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
}),
// Use calculated totals
total: data.invoiceTotals.total,
taxAmount: data.invoiceTotals.taxAmount,
retentionAmount: data.invoiceTotals.retentionAmount,
discountAmount: data.invoiceTotals.discountAmount,
};

    console.log(
      "🚀 Final Invoice Payload:",
      JSON.stringify(finalPayload, null, 2)
    );
    try {
      await invoiceService.createInvoice(finalPayload);
      toast.success("Fatura criada com sucesso!"); // criar um hook q chama o service
      router.push("/client/documents");
    } catch (error) {
      toast.error("Erro ao criar fatura!");
      console.error("Error creating invoice:", error);
    }

    // Reset form and state
    reset();

}

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
/>
<Input
type="date"
label="Data de Vencimento"
{...register("dueDate")}
error={errors.dueDate?.message}
/>

        <InputFetch
          startIcon="User"
          label="Cliente"
          placeholder="Digite o nome do cliente..."
          endpoint="/clients"
          displayFields={["name", "email"]}
          onValueChange={handleClientChange}
          minChars={1}
          debounceMs={300}
        />

        <div className="relative">
          <Input
            label="NIF"
            placeholder="5566798754"
            {...register("client.taxNumber")}
            error={errors.client?.taxNumber?.message}
            disabled={isClientFromAPI}
          />
        </div>

        <div className="relative">
          <Input
            startIcon="Phone"
            placeholder="923 456 789"
            label="Telefone do cliente"
            {...register("client.phone")}
            error={errors.client?.phone?.message}
            disabled={isClientFromAPI}
          />
        </div>

        <div className="relative">
          <Input
            startIcon="MapPin"
            placeholder="Luanda"
            label="Endereço do cliente"
            {...register("client.address")}
            error={errors.client?.address?.message}
            disabled={isClientFromAPI}
          />
        </div>
      </div>

      <InvoiceItems
        globalTax={globalTax || 0}
        fieldArray={fieldArray}
        setGlobalTax={(val) => setValue("globalTax", val)}
        globalDiscount={globalDiscount || 0}
        globalRetention={globalRetention || 0}
        onTotalsChange={(totals) => setValue("invoiceTotals", totals)}
        setGlobalDiscount={(val) => setValue("globalDiscount", val)}
        setGlobalRetention={(val) => setValue("globalRetention", val)}
      />

      <div className="flex justify-end mt-6">
        <ButtonSubmit className="sm:w-max" isLoading={isSubmitting}>
          Criar Fatura
        </ButtonSubmit>
      </div>
    </form>

);
}
