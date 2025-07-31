import Image from "next/image";
import Link from "next/link";
import { InputEmail, Label, Button } from "@/components";
import { useModal } from "@/stores/use-modal-store";
import Logo from "@/assets/brand.png";

export function SentEmail() {
  const { openModal } = useModal();
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="w-full max-w-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Image src={Logo} alt="Logo" className="size-20" />
          </div>
          <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
          <p className="text-sm text-center text-foreground/70">
            Digite seu endereço de e-mail e enviaremos instruções para redefinir
            sua senha.
          </p>
        </div>
        <div className="mt-4">
          <Label className="text-foreground/70">Email</Label>
          <InputEmail placeholder="Endereço de email" />
          <Button onClick={() => openModal("otp")} className="w-full mt-4">
            Continuar
          </Button>
          <Link href="/auth/login">
            <Button className="w-full mt-4" variant="outline">
              Voltar para Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
