import { Button, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components";


export function StoreForm () {
    return (
        <div className="space-y-8 md:p-8">
         <div className="grid gap-6 md:grid-cols-3">
            <div>
                <Label>Nome</Label>
                <Input type="text" placeholder="Ex: Ceara Coveney"/>
            </div>
            
            <div>
                <Label>Email</Label>
                <Input type="email" placeholder="Ex: Ceara Coveney"/>
            </div>

            <div>
                <Label>Telefone</Label>
                <Input type="number" placeholder="Ex: 944072491" 
                className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>

            <div>
                <Label>Endereço</Label>
                <Input type="text" placeholder="Ex: Av. Pedro Castro"/>
            </div>
            
            <div>
              <Label>Status de Atividade</Label>  
            <Select>
            <SelectTrigger>
                <SelectValue placeholder="Selecione o Tipo"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectItem value="act">Activo</SelectItem>
                <SelectItem value="des">Desativo</SelectItem>
                <SelectItem value="sus">Suspenso</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
            </div>
            
            <div>
              <Label>Gerente</Label>  
            <Select>
            <SelectTrigger>
                <SelectValue placeholder="Selecione"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectItem value="act">Débora</SelectItem>
                <SelectItem value="des">Tatiana</SelectItem>
                <SelectItem value="sus">Cutambicua</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
            </div>
            
         </div>
            <div className="flex justify-end">
                <Button variant={"default"}>Adicionar</Button>
            </div>
        </div>
    )
}