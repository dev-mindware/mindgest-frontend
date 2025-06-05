import { cn } from "@/lib/utils"
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components"
import RequiredInput from "../../../../components/custom/required-input"
import { IdCardIcon, Building2, User, MessageCircle } from "lucide-react"
import Link from "next/link"

export function FirstStep({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Crie sua conta</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <RequiredInput label="Nº de Contribuente" placeholder="558442018" type="number" icon={<IdCardIcon size={16}/>}/>
        </div>
        <div className="grid gap-3">
          <RequiredInput label="Empresa" placeholder="Mindware" type="text" icon={<Building2 size={16}/>}/>
        </div>
        <div className="grid gap-3">
          <RequiredInput label="Seu nome" placeholder="Insira seu nome" type="text" icon={<User size={16}/>}/>
        </div>

          <Tabs defaultValue="tab-1" className="items-center">
      <TabsList className="gap-1 bg-transparent">
        <TabsTrigger
          value="tab-1"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
        >
          Telefone
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
        >
          Email
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1">
        <div className="grid gap-3">
          <RequiredInput label="Telefone" placeholder="9XX-XXX-XXX" type="number" icon={<User size={16}/>}/>
        </div>
      </TabsContent>
      <TabsContent value="tab-2">
        <div className="grid gap-3">
          <RequiredInput label="Email" placeholder="seunome@email.com" type="email" icon={<MessageCircle size={16}/>}/>
        </div>
      </TabsContent>
    </Tabs>
        <Button type="submit" className="w-full">
          Próximo
        </Button>
        
      </div>
      <div className="text-sm text-center">
       Já tens uma conta?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline underline-offset-4">
          Entre
        </Link>
      </div>
    </form>
  )
}