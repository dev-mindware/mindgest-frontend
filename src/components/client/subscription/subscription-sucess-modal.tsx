"use client";
import { useModal } from "@/stores";
import { Button } from "@/components/ui";
import { GlobalModal } from "@/components/modal";
import { Icon } from "@/components/common";

export function SubscriptionSucessModal() {
  const { closeModal } = useModal();

  function handleClose() {
    closeModal("subscription-sucess");
    window.location.href = "/subscription";
  }

  return (
    <GlobalModal
      canClose={false}
      id="subscription-created"
      className="!w-lg text-center"
    >
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
          <Icon name="Check" className="w-8 h-8 text-green-600 dark:text-green-500" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            Assinatura criada com sucesso
          </h3>
          <p className="text-sm text-muted-foreground">
            Parabéns! Sua assinatura foi efectuada com sucesso. <br /> Você receberá
            uma notificação assim que estiver tudo liberado.
          </p>
        </div>

        <div className="w-full pt-4">
          <Button
            onClick={handleClose}
            className="w-full bg-primary hover:bg-primary/90 font-semibold h-11"
          >
            Fechar
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
