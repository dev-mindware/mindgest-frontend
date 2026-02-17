"use client";
import Link from "next/link";
import { useModal } from "@/stores";
import { Button } from "@/components";
import { GlobalModal } from "@/components/modal";

export function AccountCreatedModal() {
  const { closeModal } = useModal();

  return (
    <GlobalModal
      sucess
      canClose={false}
      id="account-created"
      title="Bem-vindo(a) à Mindgest!"
      className="!w-lg text-center"
      description="Sua conta foi criada com sucesso."
    >
      <div className="flex flex-col items-center justify-center py-2 space-y-4">
        <div className="w-full">
          <Link href="/auth/login" onClick={() => closeModal("account-created")} className="w-full block">
            <Button
              className="w-full bg-primary hover:bg-primary/90 font-semibold"
            >
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </GlobalModal>
  );
}