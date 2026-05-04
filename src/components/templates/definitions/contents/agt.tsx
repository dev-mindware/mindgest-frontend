"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgtKeySettings } from "./agt/agt-key-settings";
import { AgtSeriesList } from "./agt/agt-series-list";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ListOrdered, Settings } from "lucide-react";

export function Agt() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Painel AGT</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Controle a integração com a Administração Geral Tributária.
          </p>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="series" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] h-12 p-1 bg-muted/30">
          <TabsTrigger value="series" className="flex items-center gap-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ListOrdered size={14} />
            Séries Autorizadas
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Settings size={14} />
            Configurações
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="series" className="border-none p-0 outline-none">
            <AgtSeriesList />
          </TabsContent>
          <TabsContent value="settings" className="border-none p-0 outline-none">
            <AgtKeySettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
