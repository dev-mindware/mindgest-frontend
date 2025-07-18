import { InputPassword, Label, Button } from "@/components"
import Link from "next/link"
import { useModal } from "@/contexts"
import Image from "next/image"
import Logo from "@/assets/brand.png"
export function UpdatePassword (){
    const { openModal } = useModal()
    return (
        <div className="flex items-center justify-center flex-1">
      <div className="w-full max-w-xs">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
          <Image src={Logo} alt="Logo" className="size-20" />
          </div>
        <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
        </div>
        <div className="mt-4">
        <div className="space-y-4">
        <Label className="text-foreground/70">Nova Senha</Label>
        <InputPassword/>
        <Label className="text-foreground/70">Confirmar a nova senha</Label>
        <InputPassword/>
        </div>
        <Button onClick={() => openModal('pass-updated')} className="w-full mt-4">Continuar</Button>
        <Link href="/auth/login">
        <Button className="w-full mt-4" variant="outline">Voltar para Login</Button>
        </Link>
        </div>
      </div>
    </div>
    )
}