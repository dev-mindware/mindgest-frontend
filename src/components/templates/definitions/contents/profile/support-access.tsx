import { Button, Separator } from "@/components";

export function SupportAccess() {
  return (
    <div>
      <h3 className="text-2xl text-center md:text-start text-destructive">
        Zona de Perigo
      </h3>
      <p className="text-center text-muted-foreground md:text-start">
        Ações destrutivas e irreversíveis relacionadas à sua conta.
      </p>
      <Separator className="my-4" />
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              Excluir conta
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A exclusão da sua conta é uma ação permanente e irreversível.
              Todos os seus dados pessoais, configurações e acessos aos espaços
              de trabalho serão apagados imediatamente.
            </p>
          </div>
          <Button variant="destructive" className="whitespace-nowrap">
            Excluir Conta
          </Button>
        </div>
      </div>
    </div>
  );
}
