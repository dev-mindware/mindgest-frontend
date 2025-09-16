"use client";
import Link from "next/link";
import { useModal } from "@/stores";
import { Button } from "@/components/ui";
import { GlobalModal } from "@/components/modal";

export function AccountCreatedModal() {
  const { closeModal } = useModal();

  function handleClose() {
    closeModal("account-created");
  }

  return (
    <GlobalModal
      sucess
      canClose
      id="account-created"
      title={
        <p className="text-center">
          Conta criada com sucesso!
        </p>
      }
      className="p-8"
      description={
        <>
          <span className="text-lg text-gray-700 text-center">
            🎉 Parabéns! Sua conta foi criada com sucesso.
          </span>
        </>
      }
    >
      <div className="w-full mt-2 flex flex-col items-center justify-center">
        <Link
          href="/auth/login"
          className="w-full block"
        >
          <Button
            onClick={handleClose}
            className="w-full bg-primary-500 hover:bg-primary-600"
          >
            Ir para o login
          </Button>
        </Link>
      </div>
    </GlobalModal>
  );
}