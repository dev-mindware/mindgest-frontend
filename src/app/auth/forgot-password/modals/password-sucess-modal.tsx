import { GlobalModal, Button } from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { useRouter } from "next/navigation";

export function PasswordSucessModal() {
  const router = useRouter();
  const { closeModal } = useModal();

  return (
    <GlobalModal
      sucess
      canClose
      id="pass-updated"
      title="Sua senha foi alterada com sucesso!"
      footer={
        <div className="flex items-center justify-center w-full">
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => {
              closeModal("email-sent");
              router.push("/auth/login");
            }}
          >
            Voltar para o Login
          </Button>
        </div>
      }
    />
  );
}
