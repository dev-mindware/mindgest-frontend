"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator" 
import { ManagerForm } from "./collaborators-forms/manager-form"
import { CashierForm } from "./collaborators-forms/cashier-form"

export function Collaborators() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-center md:text-start">Colaboradores</h2>
        <p className="text-center text-muted-foreground md:text-start">
          Cadastre os funcionários que o ajudam no seu negócio.
        </p>
      </div>
      
        <Separator/>
        
      <Tabs defaultValue="tab-1" className="w-full">
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger value="tab-1">Gerente</TabsTrigger>
          <TabsTrigger value="tab-2">Balconista</TabsTrigger>
        </TabsList>

        <TabsContent value="tab-1">
          <ManagerForm/>
        </TabsContent>
        <TabsContent value="tab-2">
          <CashierForm/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
