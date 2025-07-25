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
import DatePickerInput from "@/components/custom/date-picker-input";
import { ClientsTable } from "@/components/custom/universal-table/custom-tables/clients-table";

export function ClientForm() {
  return (
    <div className="p-4 space-y-8 md:p-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label>Nome</Label>
          <Input type="text" placeholder="Ex: Ceara Coveney" />
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
          <Label>Tipo de Cliente</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="mei">
                  Microempreendedor Individual
                </SelectItem>
                <SelectItem value="me">Microempresa</SelectItem>
                <SelectItem value="epp">Empresa de Pequeno Porte</SelectItem>
                <SelectItem value="emp">Empresa de Médio Porte</SelectItem>
                <SelectItem value="gp">Grande Empresa</SelectItem>
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
          <Label>Endereço</Label>
          <Input type="text" placeholder="Ex: Av. Pedro Castro" />
        </div>

        <div>
          <Label>IBAN</Label>
          <Input
            type="number"
            placeholder="Ex: 0040.0000.5660.0824.1017.4"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <Label>Categoria</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="reg">Regular</SelectItem>
                <SelectItem value="cmm">Comum</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Data de Registo</Label>
          <DatePickerInput />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant={"default"}>Adicionar</Button>
      </div>
      <div className="hidden w-full md:block">
        <ClientsTable />
      </div>
    </div>
  );
}
