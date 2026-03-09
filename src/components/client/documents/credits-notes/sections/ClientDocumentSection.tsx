"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CreditNoteFormData } from "@/schemas";
import { Input } from "@/components";

interface ClientDocumentSectionProps {
    register: UseFormRegister<CreditNoteFormData>;
    errors: any;
    isInvoiceDoc: boolean;
    docType?: "invoice-receipt" | "invoice-normal";
}

export function ClientDocumentSection({
    register,
    errors,
    isInvoiceDoc,
    docType,
}: ClientDocumentSectionProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-medium">Dados do Cliente</h3>
                <Input
                    label="Nome"
                    {...register("invoiceBody.client.name")}
                    error={errors.invoiceBody?.client?.name?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="NIF"
                        {...register("invoiceBody.client.taxNumber")}
                        error={errors.invoiceBody?.client?.taxNumber?.message}
                    />
                    <Input
                        label="Telefone"
                        {...register("invoiceBody.client.phone")}
                        error={errors.invoiceBody?.client?.phone?.message}
                    />
                </div>
                <Input
                    label="Endereço"
                    {...register("invoiceBody.client.address")}
                    error={errors.invoiceBody?.client?.address?.message}
                />
            </div>

            <div className="space-y-4">
                <h3 className="font-medium">Configurações do Documento</h3>
                <Input
                    type="date"
                    label="Data de Emissão"
                    {...register("invoiceBody.issueDate")}
                    error={errors.invoiceBody?.issueDate?.message}
                />
                {isInvoiceDoc && docType !== "invoice-receipt" && (
                    <Input
                        type="date"
                        label="Data de Vencimento"
                        {...register("invoiceBody.dueDate")}
                        error={errors.invoiceBody?.dueDate?.message}
                    />
                )}
            </div>
        </div>
    );
}
