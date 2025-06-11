import { GlobalModal, Button } from "@/components"
import { useModal } from "@/contexts"
import { useRouter } from "next/navigation"

export function EmailSentModal() {
  const { closeModal } = useModal()
  const router = useRouter()

  return (
    <GlobalModal
      id="email-sent"
      title="Email enviado com sucesso!"
      description="Verifica a tua caixa de entrada. Enviámos instruções para redefinir a tua senha."
      sucess
      canClose
      footer={
        <div className="flex justify-end gap-4">
          <Button onClick={() => {
            closeModal("email-sent")
            router.push("/auth/login")
          }}>
            Próximo
          </Button>
        </div>
      }
    />
  )
}
