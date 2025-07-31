import { GlobalModal, Button } from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { useRouter } from "next/navigation";

export function EmailSentModal() {
  const router = useRouter();
  const { closeModal } = useModal();

  return (
    <GlobalModal
      sucess
      canClose
      id="email-sent"
      title="Email enviado com sucesso!"
      description="Verifica a tua caixa de entrada. Enviámos instruções para redefinir a tua senha."
      footer={
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              closeModal("email-sent");
              router.push("/auth/login");
            }}
          >
            Próximo
          </Button>
        </div>
      }
    />
  );
}
