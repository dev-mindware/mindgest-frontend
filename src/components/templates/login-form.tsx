import { cn } from "@/lib/utils"
import { InputPassword, InputEmail, Label, Button } from "@/components"
import IconGoogle from '@/assets/IconGoogle.svg'
import Image from "next/image"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <InputEmail placeholder="Endereço de email"/>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <InputPassword placeholder="Insira a senha" />
        </div>
        <Link href="/management/dashboard">
        <Button type="submit" className="w-full">
          Login
        </Button>
        </Link>
        <div className="relative text-sm text-center after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="relative z-10 px-2 bg-background text-muted-foreground">
            Ou
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <Image src={IconGoogle} alt="icon" width={16}/>
          Login com Google
        </Button>
      </div>
      <div className="text-sm text-center">
       Não tem uma conta?{" "}
        <Link href="/auth/register" className="font-medium text-primary hover:underline underline-offset-4">
          Crie nova
        </Link>
      </div>
    </form>
  )
}
