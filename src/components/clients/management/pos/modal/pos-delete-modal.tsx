"use client";

import { Button, GlobalModal } from "@/components";
import { useModal } from "@/stores";
import { useCurrentCashierStore } from "@/stores/pos/current-cashier-store";
import { toast } from "sonner";

export function PosDeleteModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["delete-cashier"];
  const { currentCashier, setCurrentCashier } = useCurrentCashierStore();

  // Since we don't have a real delete hook for POS yet, we simulate it
  const isPending = false;

  const handleDelete = async () => {
    if (!currentCashier) return;

    try {
      console.log("Deletando caixa:", currentCashier.id);
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Caixa ${currentCashier.name} removido com sucesso.`);
      setCurrentCashier(null);
      closeModal("delete-cashier");
    } catch (error) {
      toast.error("Erro ao remover o caixa. Tente novamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <GlobalModal
      warning
      canClose
      className="!w-max"
      id="delete-cashier"
      title={`Tem certeza que deseja apagar o ${currentCashier?.name}?`}
      description="Lembre-se que esta ação não pode ser desfeita."
    >
      <div className="flex justify-end gap-4 pt-4">
        <Button
          onClick={() => {
            closeModal("delete-cashier");
            setCurrentCashier(null);
          }}
          variant="outline"
        >
          Cancelar
        </Button>
        <Button
          loading={isPending}
          variant="destructive"
          onClick={handleDelete}
        >
          {isPending ? "Apagando..." : `Apagar ${currentCashier?.name}`}
        </Button>
      </div>
    </GlobalModal>
  );
}
