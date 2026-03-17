"use client";
import { UseFormRegister } from "react-hook-form";
import { CreditNoteFormData } from "@/schemas";
import { Icon, Input } from "@/components";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Client } from "@/types/clients";

interface ClientDocumentSectionProps {
    register: UseFormRegister<CreditNoteFormData>;
    errors: any;
    isInvoiceDoc: boolean;
    docType?: "invoice-receipt" | "invoice-normal";
    client?: Client;
}

export function ClientDocumentSection({
    register,
    errors,
    isInvoiceDoc,
    docType,
    client,
}: ClientDocumentSectionProps) {
    const hasClient = !!client?.id;

    return (
        <div className="space-y-6">
            {!hasClient && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                    <Icon name="BadgeAlert" className="h-4 w-4" />
                    <AlertTitle>Dados do Cliente em Falta</AlertTitle>
                    <AlertDescription>
                        Os dados do cliente não aparecem neste documento. Por favor, atualize os dados do cliente antes de prosseguir com a nota de crédito.
                    </AlertDescription>
                </Alert>
            )}

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
        </div>
    );
}
