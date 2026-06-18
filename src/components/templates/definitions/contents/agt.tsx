"use client";

import { useState } from "react";
import { Icon, Separator } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgtConsultation } from "./agt/agt-consultation";
import { AgtInvoiceList } from "./agt/agt-invoice-list";
import { AgtKeySettings } from "./agt/agt-key-settings";
import { AgtSeriesList } from "./agt/agt-series-list";

const AGT_TABS = [
  {
    value: "series",
    label: "Séries",
    icon: "ListOrdered",
  },
  {
    value: "repository",
    label: "Repositório",
    icon: "Search",
  },
  {
    value: "consultation",
    label: "Consulta",
    icon: "FileSearch",
  },
  {
    value: "settings",
    label: "Configurações",
    icon: "Settings",
  },
] as const;

export function Agt() {
  const [activeTab, setActiveTab] = useState("series");
  const [searchDocNo, setSearchDocNo] = useState("");

  const handleConsult = (docNo: string) => {
    setSearchDocNo(docNo);
    setActiveTab("consultation");
  };

  return (
    <section className="space-y-6" data-tour="setup-agt-content">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">AGT</h2>
        <p className="text-sm text-muted-foreground">
          Gira séries, documentos e validações fiscais da Administração Geral Tributária.
        </p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="relative -mx-1 overflow-x-auto px-1">
          <TabsList className="inline-flex h-auto w-max min-w-full justify-start gap-1 rounded-md bg-muted/40 p-1 sm:w-auto sm:min-w-0">
            {AGT_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="min-w-max gap-2 px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Icon name={tab.icon} className="h-4 w-4 text-muted-foreground" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-6 rounded-lg border bg-card p-4 shadow-sm sm:p-5">
          <TabsContent value="series" className="m-0 border-none p-0 outline-none">
            <AgtSeriesList />
          </TabsContent>
          <TabsContent
            value="repository"
            className="m-0 border-none p-0 outline-none"
          >
            <AgtInvoiceList onConsult={handleConsult} />
          </TabsContent>
          <TabsContent
            value="consultation"
            className="m-0 border-none p-0 outline-none"
          >
            <AgtConsultation
              externalDocNo={searchDocNo}
              clearExternalDocNo={() => setSearchDocNo("")}
            />
          </TabsContent>
          <TabsContent value="settings" className="m-0 border-none p-0 outline-none">
            <AgtKeySettings />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
