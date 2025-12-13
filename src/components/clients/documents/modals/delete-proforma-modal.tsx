import { proformaService } from "@/services/proforma-service";
import { Button, GlobalModal } from "@/components";
import { currentProformaStore } from "@/stores";
import { useModal } from "@/stores/use-modal-store";
import { toast } from "sonner";
import { queryClient } from "@/lib";

export function DeleteProformaModal() {
    const { closeModal, open } = useModal();
    const isOpen = open["delete-proforma"]
    const { currentProforma } = currentProformaStore();

    async function handlerDeleteProforma() {
        if (!currentProforma?.id) {
            toast.error("Proforma não selecionada");
            return;
        }

        try {
            await proformaService.deleteProforma(currentProforma.id);
            toast.success("Proforma apagada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["proform"] });
            handleClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Erro ao cancelar fatura");
        }
    }
    const handleClose = () => {
        closeModal("delete-proforma");
    };

    if (!isOpen) return null;

    return (
        <GlobalModal
            warning
            canClose
            className="!w-max"
            id="delete-proforma"
            title={`Tem certeza que deseja apagar a proforma? ${currentProforma?.number}`}
            description="Lembre-se que esta ação não pode ser desfeita."
        >
            <div className="flex justify-end gap-4">
                <Button onClick={() => closeModal("delete-proforma")} variant="outline">
                    Cancelar
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => handlerDeleteProforma()}
                >
                    Apagar Proforma
                </Button>
            </div>
        </GlobalModal>
    );
}
