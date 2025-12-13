"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal, currentInvoiceStore } from "@/stores";
import { ReceiptFormData, ReceiptSchema } from "@/schemas";
import { Button, Input, GlobalModal, ButtonSubmit, RHFSelect } from "@/components";
import { receiptService } from "@/services/receipt-service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const paymentOptions = [
    { label: "Dinheiro", value: "CASH" },
    { label: "Cartão", value: "CARD" },
    { label: "Transferência", value: "TRANSFER" },
];

export function GenerateReceiptModal() {
    const { closeModal, open } = useModal();
    const isOpen = open["generate-receipt"];
    const { currentInvoice } = currentInvoiceStore();
    const queryClient = useQueryClient();

    const {
        reset,
        register,
        watch,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ReceiptFormData>({
        resolver: zodResolver(ReceiptSchema),
        mode: "onChange",
        defaultValues: {
            issueDate: new Date().toISOString().split("T")[0],
            paymentMethod: "CASH",
        },
    });

    useEffect(() => {
        if (currentInvoice && isOpen) {
            setValue("total", parseFloat(currentInvoice.total) || 0);
            setValue("originalInvoiceId", currentInvoice.id);
        }
    }, [currentInvoice, isOpen, setValue]);

    async function onSubmit(data: ReceiptFormData) {
        if (!currentInvoice?.id) {
            toast.error("Fatura não selecionada");
            return;
        }

        try {
            await receiptService.generateReceipt(currentInvoice.id, data);
            toast.success("Recibo gerado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["invoice-normal"] });
            queryClient.invalidateQueries({ queryKey: ["receipts"] });
            handleCancel();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Erro ao gerar recibo");
            console.error("Error generating receipt:", error);
        }
    }

    const handleCancel = () => {
        reset();
        closeModal("generate-receipt");
    };

    if (!isOpen) return null;

    return (
        <GlobalModal
            canClose
            id="generate-receipt"
            title="Gerar Recibo"
            className="!max-h-[85vh] !w-max"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Data de Emissão"
                        type="date"
                        startIcon="Calendar"
                        {...register("issueDate")}
                        error={errors.issueDate?.message}
                        disabled
                    />

                    <Input
                        label="Total"
                        type="number"
                        step="0.01"
                        startIcon="DollarSign"
                        {...register("total", { valueAsNumber: true })}
                        error={errors.total?.message}
                        disabled
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <RHFSelect
                        name="paymentMethod"
                        label="Método de Pagamento"
                        options={paymentOptions}
                        control={control}
                    />
                </div>

                <div className="col-span-2">
                    <Input
                        label="Observações (Opcional)"
                        placeholder="Ex: Pagamento recebido para pedido #12345"
                        {...register("notes")}
                        error={errors.notes?.message}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-5">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <ButtonSubmit className="w-max" isLoading={isSubmitting}>
                        Gerar Recibo
                    </ButtonSubmit>
                </div>
            </form>
        </GlobalModal>
    );
}
