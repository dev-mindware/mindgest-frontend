"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/utils/messages";
import { useModal, currentStockStore } from "@/stores";
import { StockFormData, stockSchema } from "@/schemas/stock-schema";
import { useAddStock, useUpdateStock } from "@/hooks/stock";
import { Button, Input, GlobalModal, ButtonSubmit, RHFSelect } from "@/components";
import { useGetStores } from "@/hooks/entities";
import { useGetItems } from "@/hooks/stock";

type StockModalProps = {
    action: "add" | "edit";
};

export function StockModal({ action }: StockModalProps) {
    const { closeModal, open } = useModal();
    const isOpen = open["add-stock"] || open["edit-stock"];
    const { currentStock } = currentStockStore();

    const { mutateAsync: addStock, isPending: isAdding } = useAddStock();
    const { mutateAsync: editStock, isPending: isEditing } = useUpdateStock();
    const { stores } = useGetStores();
    const { items } = useGetItems();

    const {
        reset,
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<StockFormData>({
        resolver: zodResolver(stockSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (action === "edit" && currentStock) {
            reset({
                quantity: currentStock.quantity,
                itemsId: currentStock.itemsId,
                storeId: currentStock.storeId,
                reserved: currentStock.reserved,
            });
        }
    }, [action, currentStock, reset]);

    async function onSubmit(data: StockFormData) {
        try {
            if (action === "add") {
                await addStock(data);
            } else if (action === "edit" && currentStock) {
                // When editing, only send quantity and reserved (not storeId and itemsId)
                const { quantity, reserved } = data;
                await editStock({
                    id: currentStock.id,
                    data: { quantity, reserved }
                });
            }

            handleCancel();
        } catch (error: any) {
            ErrorMessage(
                error?.response?.data?.message ||
                "Ocorreu um erro ao salvar o stock."
            );
        }
    }

    const handleCancel = () => {
        reset();
        closeModal(action === "add" ? "add-stock" : "edit-stock");
    };

    if ((action === "edit" && !currentStock) || !isOpen) return null;

    return (
        <GlobalModal
            canClose
            id={action === "add" ? "add-stock" : "edit-stock"}
            title={action === "add" ? "Adicionar Stock" : "Editar Stock"}
            className="!max-h-[85vh] !w-max"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-2">
                    <RHFSelect
                        control={control}
                        name="itemsId"
                        label="Produto"
                        options={items}
                        disabled={action === "edit"}
                    />

                    <RHFSelect
                        control={control}
                        name="storeId"
                        label="Loja"
                        options={stores}
                        disabled={action === "edit"}
                    />

                    <Input
                        type="number"
                        label="Quantidade"
                        placeholder="Ex: 100"
                        {...register("quantity", { valueAsNumber: true })}
                        error={errors.quantity?.message}
                    />

                    <Input
                        type="number"
                        label="Reservado"
                        placeholder="Ex: 0"
                        {...register("reserved", { valueAsNumber: true })}
                        error={errors.reserved?.message}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-5">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <ButtonSubmit
                        className="w-max"
                        isLoading={isSubmitting || isAdding || isEditing}
                    >
                        {action === "add" ? "Adicionar" : "Salvar Alterações"}
                    </ButtonSubmit>
                </div>
            </form>
        </GlobalModal>
    );
}
