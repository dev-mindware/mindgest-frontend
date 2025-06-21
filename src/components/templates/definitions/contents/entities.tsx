"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs" // Certifica-te que este é o caminho certo
import { Separator } from "@/components/ui/separator" // E este também!
import { ClientForm } from "./entities-forms/client-form"
import { SupplierForm } from "./entities-forms/supplier-form"
import { StoreForm } from "./entities-forms/store-form"

export function Entities() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-center md:text-start">Entidades</h2>
        <p className="text-center text-muted-foreground md:text-start">
          Crie entidades que ajudaram no controlo das suas atividades.
        </p>
      </div>
      
        <Separator/>
        
      <Tabs defaultValue="tab-1" className="w-full">
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger value="tab-1">Cliente</TabsTrigger>
          <TabsTrigger value="tab-2">Fornecedor</TabsTrigger>
          <TabsTrigger value="tab-3">Loja</TabsTrigger>
        </TabsList>

        <TabsContent value="tab-1">
          <ClientForm/>
        </TabsContent>
        <TabsContent value="tab-2">
          <SupplierForm/>
        </TabsContent>
        <TabsContent value="tab-3">
          <StoreForm/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
