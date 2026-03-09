"use client";
import Logo from "@/assets/brand.png";
import Image from "next/image";
import { ButtonSubmit, Input, ResetPasswordSkeleton } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordFormData, changePasswordSchema } from "@/schemas";
import { ErrorMessage } from "@/utils/messages";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/auth";
import { AuthHeader, BackToLogin } from "../_components";
import { Suspense } from "react";
import { useModal } from "@/stores";
import { SuccessResetModal } from "./success-reset-modal";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { openModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  async function onChangePassword(data: ChangePasswordFormData) {
    if (!token) {
      ErrorMessage(
        "Token de recuperação de senha não encontrado ou inválido. Por favor, solicite a recuperação novamente.",
      );
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });
      openModal("success-reset-modal");
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message ||
        "Ocorreu um erro ao alterar a senha. Tente mais tarde.",
      );
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-sm mx-auto mb-24 sm:mb-0">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Image src={Logo} alt="Logo" className="size-20" />
          </div>
          <AuthHeader
            title="Nova Senha"
            description="Digite a sua nova senha e confirme para recuperar o acesso à sua conta."
          />
        </div>

        <form onSubmit={handleSubmit(onChangePassword)} className="grid gap-6">
          <Input
            type="password"
            label="Nova Senha"
            {...register("newPassword")}
            placeholder="Digite sua nova senha"
            error={errors.newPassword && errors.newPassword?.message}
          />
          <Input
            type="password"
            label="Confirmar Nova Senha"
            placeholder="Confirme sua nova senha"
            {...register("confirmPassword")}
            error={
              errors.confirmPassword &&
              errors.confirmPassword?.message
            }
          />
          <ButtonSubmit isLoading={isPending} className="w-full">
            Confirmar
          </ButtonSubmit>
          <BackToLogin />
        </form>
      </div>

      <SuccessResetModal />
    </>
  );
}

export function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
