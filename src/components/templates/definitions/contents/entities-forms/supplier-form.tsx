import { Button, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components";
import { SuppliersTable } from "@/components/custom/universal-table/custom-tables/supliers-table";
import InnerTagsInput from "@/components/custom/ínner-tags-input";

export function SupplierForm() {
  return (
    <div className="p-4 space-y-8 md:p-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label>Nome</Label>
          <Input type="text" placeholder="Ex: Ceara Coveney" />
        </div>

        <div>
          <Label>Tipo de Fornecedor</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="emp">Empresa</SelectItem>
                <SelectItem value="par">Particular</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
          <Label>Email</Label>
          <Input type="email" placeholder="Ex: cea.co@gmail.com" />
        </div>

        <div>
          <Label>NIF</Label>
          <Input
            type="number"
            placeholder="Ex: 546829403"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <Label>Endereço</Label>
          <Input type="text" placeholder="Ex: Av. Pedro Castro" />
        </div>

        <div>
          <Label>Tipo de Fornecimento</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="src">Serviço</SelectItem>
                <SelectItem value="prd">Produto</SelectItem>
                <SelectItem value="amb">Ambos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Prazo de Entrega</Label>  
          <Input type="text" placeholder="Ex: 2 dias"/>
        </div>

        <div className="*:not-first:mt-2">
          <Label>Produtos ou Categorias</Label>
          <InnerTagsInput />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant={"default"}>Adicionar</Button>
      </div>
      <div className="hidden w-full md:block">
        <SuppliersTable/>
      </div>
    </div>
  );
}