"use client";

import { useModal } from "@/stores";
import { useChangePassword } from "@/hooks/users";
import { Button, Input } from "@/components";
import { GlobalModal } from "@/components/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage, SucessMessage } from "@/utils";
import { changePasswordSchema, ChangePasswordFormData } from "@/schemas/change-password";


interface Props {
    userId: string;
}

export function ChangePasswordModal({ userId }: Props) {
    const { closeModal } = useModal();
    const { mutate: changePassword, isPending } = useChangePassword();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changePassword(
            { id: userId, data: { newPassword: data.newPassword } },
            {
                onSuccess: () => {
                    SucessMessage("Senha alterada com sucesso!");
                    reset();
                    closeModal("change-password");
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    ErrorMessage(error?.response?.data?.message || "Erro ao alterar a senha.");
                },
            }
        );
    };

    return (
        <GlobalModal
            id="change-password"
            title="Alterar Senha"
            description="Crie uma nova senha forte para a sua conta."
            canClose
            className="max-w-md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <Input
                    label="Nova Senha"
                    type="password"
                    placeholder="Insira a nova senha"
                    error={errors.newPassword?.message}
                    {...register("newPassword")}
                />
                <Input
                    label="Confirmar Senha"
                    type="password"
                    placeholder="Repita a nova senha"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="ghost" onClick={() => closeModal("change-password")} disabled={isPending}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "A gravar..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </GlobalModal>
    );
}
