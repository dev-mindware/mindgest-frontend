"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/utils/messages";
import { useModal, currentInvoiceStore } from "@/stores";
import { ReceiptFormData, ReceiptSchema } from "@/schemas";
import { useGenerateReceipt } from "@/hooks/invoice";
import { Button, Input, GlobalModal, ButtonSubmit, RHFSelect } from "@/components";

export const paymentOptions = [
  { label: "Transferência Bancária", value: "bank_transfer" },
  { label: "Dinheiro", value: "cash" },
  { label: "Cartão", value: "card" },
];

export function ReceiptModal() {
    const { closeModal, open } = useModal();
    const isOpen = open["generate-receipt"];
    const { currentInvoice } = currentInvoiceStore();

    const { mutateAsync: generateReceipt, isPending: isGenerating } = useGenerateReceipt();

    const {
        reset,
        register,
        watch,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ReceiptFormData>({
        resolver: zodResolver(ReceiptSchema),
        mode: "onChange",
        defaultValues: {
            issueDate: new Date().toISOString().split("T")[0],
        },
    });

    async function onSubmit(data: ReceiptFormData) {
        try {
            await generateReceipt(currentInvoice?.id, data);
            handleCancel();
        } catch (error: any) {
            ErrorMessage(error?.response?.data?.message || "Ocorreu um erro ao gerar o recibo.");
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Data de Pagamento"
                        type="date"
                        startIcon="Calendar"
                        {...register("issueDate")}
                        error={errors.issueDate?.message}
                    />

                    <div className="relative gap-6">
                        <RHFSelect
                            name="paymentMethod.method"
                            label="Método de Pagamento"
                            options={paymentOptions}
                            control={control}
                        />
                        {watch("paymentMethod.method") === "bank_transfer" && (
                            <Input
                                label="IBAN"
                                placeholder="Ex: AO06 0000 0000 0000 0000 0000 0"
                                className="md:col-span-2"
                                {...register("paymentMethod.bankDetails")}
                                error={errors.paymentMethod?.bankDetails?.message}
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-5">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <ButtonSubmit
                        className="w-max"
                        isLoading={isGenerating}
                    >
                        Gerar Recibo
                    </ButtonSubmit>
                </div>
            </form>
        </GlobalModal>
    );
}
