"use client";
import Image from "next/image";
import { Button, Input } from "@/components";
import { useModal } from "@/stores/use-modal-store";
import Logo from "@/assets/brand.png";
import { ForgotPasswordFormData } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schemas";
import { ErrorMessage } from "@/utils/messages";
import { OTPModal } from "./otp-modal";
import { BackToLogin } from "../back-to-login";

export function SentEmail() {
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
      ErrorMessage("Ocorreu um erro ao enviar o email, Tente mais tarde.");
    }
  }

  return (
    <>
      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Image src={Logo} alt="Logo" className="size-20" />
            </div>
            <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
            <p className="text-sm text-center text-foreground/70">
              Digite seu endereço de e-mail e enviaremos instruções para
              redefinir sua senha.
            </p>
          </div>
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              startIcon="Mail"
              {...register("email")}
              placeholder="Endereço de email"
              error={errors.email && errors.email?.message}
            />
            <Button loading={isSubmitting} className="w-full mt-4">
              Verificar
            </Button>
            <BackToLogin />
          </form>
        </div>
      </div>
      <OTPModal email={email} />
    </>
  );
}