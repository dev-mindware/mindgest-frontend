"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    GlobalModal,
    Input,
    Button,
    RHFSelect,
    RequestError,
} from "@/components";
import { useModal, currentStoreStore } from "@/stores";
import { useGetStores } from "@/hooks/entities";
import { PosOpeningCashierFormData, posOpeningCashierSchema } from "@/schemas/pos-opening";
import { cashSessionsService } from "@/services/cash-sessions-service";
import { SucessMessage } from "@/utils/messages";
import { useAuth } from "@/hooks/auth";
import { ManagerAuthModal, MODAL_MANAGER_AUTH_ID } from "../..";

export function PosOpeningCashierModal() {
    const { closeModal, openModal } = useModal();
    const { stores, isLoading: isLoadingStores, error, refetch } = useGetStores();
    const { user } = useAuth();
    const { currentStore } = currentStoreStore();
    const [pendingData, setPendingData] = useState<Partial<PosOpeningCashierFormData> | null>(null);

    const {
        register,
        control,
        reset,
        trigger,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<PosOpeningCashierFormData>({
        resolver: zodResolver(posOpeningCashierSchema),
        defaultValues: {
            initialCapital: "",
            workTime: "",
            storeId: currentStore?.id || "",
            fundType: "Coin",
            managerBarcode: "", // Will be filled by ManagerAuthModal
            cashierId: user?.id,
        },
    });

    const handleClose = () => {
        reset();
        setPendingData(null);
        closeModal("opening-cashier-session");
    };

    const handleNextStep = async () => {
        // Validate fields except managerBarcode
        const isValid = await trigger(["initialCapital", "workTime", "storeId", "fundType"]);

        if (isValid) {
            const data = getValues();
            setPendingData(data);
            openModal(MODAL_MANAGER_AUTH_ID);
        }
    };

    const handleAuthenticated = async (barcode: string) => {
        if (!pendingData) return;

        try {
            const payload = {
                ...pendingData,
                managerBarcode: barcode,
                cashierId: user?.id
            };
            await cashSessionsService.openSession(payload);
            SucessMessage("Sessão de caixa aberta com sucesso!");
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoadingStores) {
        return (
            <GlobalModal id="opening-cashier-session" title="Abertura de Caixa" canClose>
                <div className="p-8 text-center flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground font-medium">
                        Carregando lojas...
                    </p>
                </div>
            </GlobalModal>
        );
    }

    if (error) {
        return (
            <GlobalModal id="opening-cashier-session" title="Abertura de Caixa" canClose>
                <div className="p-4">
                    <RequestError
                        refetch={refetch}
                        message="Ocorreu um erro ao carregar as lojas"
                    />
                </div>
            </GlobalModal>
        );
    }

    return (
        <>
            <GlobalModal
                id="opening-cashier-session"
                title="Abertura de Caixa"
                description="Preencha os dados para iniciar sua sessão de caixa."
                canClose
                className="sm:max-w-[500px]"
            >
                <form className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Capital Inicial"
                                placeholder="0"
                                startIcon="CircleDollarSign"
                                {...register("initialCapital")}
                                error={errors.initialCapital?.message}
                            />

                            <Input
                                label="Tempo de Expediente"
                                placeholder="HH:MM"
                                startIcon="Clock"
                                {...register("workTime")}
                                error={errors.workTime?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <RHFSelect
                                name="storeId"
                                control={control}
                                label="Loja"
                                options={stores}
                            />

                            <RHFSelect
                                name="fundType"
                                control={control}
                                label="Tipo de Fundo"
                                placeholder="Selecione"
                                options={[
                                    { label: "Moeda", value: "Coin" },
                                    { label: "Nota", value: "Note" },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-muted-foreground/5">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleNextStep}
                            loading={isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Abrir Caixa
                        </Button>
                    </div>
                </form>
            </GlobalModal>

            <ManagerAuthModal onAuthenticated={handleAuthenticated} />
        </>
    );
}
