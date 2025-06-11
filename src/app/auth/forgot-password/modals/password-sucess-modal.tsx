import { GlobalModal, Button } from "@/components"
import { useModal } from "@/contexts"
import { useRouter } from "next/navigation"

export function PasswordSucessModal() {
  const { closeModal } = useModal()
  const router = useRouter()

  return (
    <GlobalModal
      id="pass-updated"
      title="Sua senha foi alterada com sucesso!"
      sucess
      canClose
      footer={
        <div className="flex items-center justify-center w-full">
          <Button className="w-full" variant={"outline"} onClick={() => {
            closeModal("email-sent")
            router.push("/auth/login")
          }}>
            Voltar para o Login
          </Button>
        </div>
      }
    />
  )
}
