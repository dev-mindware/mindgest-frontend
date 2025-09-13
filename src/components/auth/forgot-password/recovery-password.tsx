"use client";
import Logo from "@/assets/brand.png";
import { ButtonSubmit, Input } from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { ForgotPasswordFormData } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schemas";
import { ErrorMessage } from "@/utils/messages";
import { OTPModal } from "./otp-modal";
import { AuthHeader, BackToLogin } from "../_components";
import { cn } from "@/lib";
import Image from "next/image";

export function RecoveryPassword() {
  const { openModal } = useModal();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const email = getValues("email");

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      openModal("otp-modal");
    } catch (error) {
      ErrorMessage("Ocorreu um erro ao enviar o email. Tente mais tarde.");
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col gap-6 w-full max-w-sm mx-auto mb-24 sm:mb-0"
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Image src={Logo} alt="Logo" className="size-20" />
          </div>
          <AuthHeader
            title="Recuperar Senha"
            description="Digite seu endereço de e-mail e enviaremos instruções para redefinir sua senha."
          />
        </div>

        <div className="grid gap-6">
          <Input
            label="Email"
            type="email"
            startIcon="Mail"
            {...register("email")}
            placeholder="Endereço de email"
            error={errors.email?.message}
          />

          <ButtonSubmit isLoading={isSubmitting} className="w-full">
            {isSubmitting ? "Enviando..." : "Verificar"}
          </ButtonSubmit>

          <BackToLogin />
        </div>
      </form>
      <OTPModal email={email} />
    </>
  );
}
