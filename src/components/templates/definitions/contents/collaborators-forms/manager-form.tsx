import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

export function ManagerForm() {
  return (
    <div className="space-y-8 md:p-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label>Nome</Label>
          <Input type="text" placeholder="Ex: Ceara Coveney" />
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="Ex: Ceara Coveney" />
        </div>

        <div>
          <Label>Telefone</Label>
          <Input
            type="number"
            placeholder="Ex: 944072491"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <Label>Senha</Label>
          <Input type="password" placeholder="Ex: Av. Pedro Castro" />
        </div>

        <div>
          <Label>Cargo</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="act">Gerente Geral</SelectItem>
                <SelectItem value="des">Gerente Administrativo</SelectItem>
                <SelectItem value="sus">Supervisor</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Label>Permissões</Label>
      <div>
        <div className="flex gap-2">
          <input type="checkbox" name="" id="" />
          <p className="text-sm">Criar / Editar / Deletar</p>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" name="" id="" />
          <p className="text-sm">Ver Relatórios</p>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" name="" id="" />
          <p className="text-sm">Faturação</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant={"default"}>Adicionar</Button>
      </div>
    </div>
  );
}
