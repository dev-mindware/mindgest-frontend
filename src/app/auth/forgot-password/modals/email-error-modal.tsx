import { GlobalModal } from "@/components"

export function EmailErrorModal() {

  return (
    <GlobalModal
      id="email-error"
      title="Ocorreu um erro ao enviar o email!"
      description="Contacte o suporte ou tente novamente mais tarde."
      warning
      canClose
    />
  )
}
