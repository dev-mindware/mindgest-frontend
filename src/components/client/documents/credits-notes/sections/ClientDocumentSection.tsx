"use client";
import { UseFormRegister } from "react-hook-form";
import { CreditNoteFormData } from "@/schemas";
import { Icon, Input } from "@/components";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Client } from "@/types/clients";

import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";

interface ClientDocumentSectionProps {
    register: UseFormRegister<CreditNoteFormData>;
    errors: any;
    isInvoiceDoc: boolean;
    docType?: "invoice-receipt" | "invoice-normal";
    client?: Client;
    selectedClient: any;
    onClientChange: (option: any) => void;
}

export function ClientDocumentSection({
    register,
    errors,
    isInvoiceDoc,
    docType,
    client,
    selectedClient,
    onClientChange,
}: ClientDocumentSectionProps) {
    const hasClient = !!client?.id;

    return (
        <div className="space-y-6">
            {!hasClient && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                    <Icon name="BadgeAlert" className="h-4 w-4" />
                    <AlertTitle>Dados do Cliente em Falta</AlertTitle>
                    <AlertDescription>
                        Os dados do cliente não constam deste documento. Seleccione ou actualize os dados do cliente antes de prosseguir com a nota de crédito.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-medium">Dados do Cliente</h3>
                    <AsyncCreatableSelectField
                        minChars={2}
                        endpoint="/clients"
                        label="Nome"
                        placeholder="Pesquise o nome do cliente..."
                        value={selectedClient}
                        onChange={onClientChange}
                        displayFields={["name"]}
                        formatCreateLabel={(inputValue: string) => `➕ Criar "${inputValue}"`}
                        error={errors.invoiceBody?.client?.id?.message || errors.invoiceBody?.client?.name?.message}
                    />
                    <input type="hidden" {...register("invoiceBody.client.id")} />
                    <input type="hidden" {...register("invoiceBody.client.name")} />
                    {selectedClient ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="NIF"
                                    {...register("invoiceBody.client.taxNumber")}
                                    error={errors.invoiceBody?.client?.taxNumber?.message}
                                    disabled={!selectedClient?.__isNew__}
                                    placeholder="999999999"
                                />
                                <Input
                                    label="Telefone"
                                    {...register("invoiceBody.client.phone")}
                                    error={errors.invoiceBody?.client?.phone?.message}
                                    disabled={!selectedClient?.__isNew__}
                                    placeholder="9xxxxxxxx"
                                />
                            </div>
                            <Input
                                label="Endereço"
                                {...register("invoiceBody.client.address")}
                                error={errors.invoiceBody?.client?.address?.message}
                                disabled={!selectedClient?.__isNew__}
                                placeholder="Luanda, Angola"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg bg-muted/5 text-muted-foreground min-h-[148px] text-center border-muted-foreground/20 animate-in fade-in duration-300">
                            <Icon name="User" className="h-8 w-8 mb-2 opacity-40 text-muted-foreground" />
                            <p className="text-sm font-semibold text-foreground/80">Os dados do cliente aparecerão aqui</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium">Configurações do documento</h3>
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
