"use client";
import Link from "next/link";
import { useModal } from "@/stores";
import { Button } from "@/components/ui";
import { GlobalModal } from "@/components/modal";

export function SubscriptionSucessModal() {
  const { closeModal } = useModal();

  function handleClose() {
    closeModal("subscription-sucess");
  }

  return (
    <GlobalModal
      sucess
      canClose
      id="subscription-sucess"
      title={
        <span className="text-center">Assinatura efectuada com sucesso!</span>
      }
      className="p-8"
      description={
        <>
          <span className="text-lg text-foreground text-center">
            🎉 Parabéns! Sua assinatura foi efectuada com sucesso.
          </span>
        </>
      }
    >
      <div className="w-full mt-2 flex flex-col items-center justify-center">
        <Link href="/client/dashboard" className="w-full block">
          <Button
            onClick={handleClose}
            className="w-full bg-primary-500 hover:bg-primary-600"
          >
            Ir para o dashboard
          </Button>
        </Link>
      </div>
    </GlobalModal>
  );
}
