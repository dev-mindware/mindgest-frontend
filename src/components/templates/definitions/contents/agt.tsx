"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgtKeySettings } from "./agt/agt-key-settings";
import { AgtSeriesList } from "./agt/agt-series-list";
import { AgtInvoiceList } from "./agt/agt-invoice-list";
import { AgtConsultation } from "./agt/agt-consultation";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ListOrdered, Settings, Search, FileSearch } from "lucide-react";
export function Agt() {
  const [activeTab, setActiveTab] = useState("series");
  const [searchDocNo, setSearchDocNo] = useState("");

  const handleConsult = (docNo: string) => {
    setSearchDocNo(docNo);
    setActiveTab("consultation");
  };

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-[800px] h-12 p-1 bg-muted/30">
          <TabsTrigger value="series" className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-tight data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ListOrdered size={14} />
            Séries
          </TabsTrigger>
          <TabsTrigger value="repository" className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-tight data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Search size={14} />
            Listagem
          </TabsTrigger>
          <TabsTrigger value="consultation" className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-tight data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileSearch size={14} />
            Consulta/Validação
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-tight data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Settings size={14} />
            Configurações
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="series" className="border-none p-0 outline-none">
            <AgtSeriesList />
          </TabsContent>
          <TabsContent value="repository" className="border-none p-0 outline-none">
            <AgtInvoiceList onConsult={handleConsult} />
          </TabsContent>
          <TabsContent value="consultation" className="border-none p-0 outline-none">
            <AgtConsultation externalDocNo={searchDocNo} clearExternalDocNo={() => setSearchDocNo("")} />
          </TabsContent>
          <TabsContent value="settings" className="border-none p-0 outline-none">
            <AgtKeySettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
