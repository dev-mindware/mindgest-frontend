"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCards from "../product-cards";

export function TabsBilling() {
  return (
    <div>
    <Tabs defaultValue="tab-1">
      <div className="flex flex-col w-full gap-6 lg:flex-row lg:items-start">
        <div className="w-full lg:w-auto">
          <h1 className="mb-4 text-xl text-center sm:text-2xl text-foreground lg:text-left">
            Alterne entre os tipos de Faturas
          </h1>
          <div className="flex justify-center lg:justify-start">
            <TabsList>
              <TabsTrigger value="tab-1">Fatura Normal</TabsTrigger>
              <TabsTrigger value="tab-2">Fatura Recibo</TabsTrigger>
              <TabsTrigger value="tab-3">Fatura Proforma</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex justify-center flex-1 lg:justify-end">
          <div className="w-full max-w-md px-4 sm:px-0">
            <TabsContent value="tab-1" className="mt-6 lg:mt-0">
              <h1 className="mb-2 text-xl text-center sm:text-2xl text-foreground lg:text-left">
                Template da Fatura
              </h1>
              <p className="text-sm text-center text-muted-foreground lg:text-left">
                Acompanhe os items da fatura neste campo com cálculos em tempo
                real
              </p>
            </TabsContent>

            <TabsContent value="tab-2" className="mt-6 rounded-md lg:mt-0">
              <h1 className="mb-2 text-xl text-center sm:text-2xl text-foreground lg:text-left">
                Template do Recibo
              </h1>
              <p className="text-sm text-center text-muted-foreground lg:text-left">
                Acompanhe os items do recibo neste campo com cálculos em tempo
                real
              </p>
            </TabsContent>

            <TabsContent value="tab-3" className="mt-6 lg:mt-0">
              <h1 className="mb-2 text-xl text-center sm:text-2xl text-foreground lg:text-left">
                Template da Proforma
              </h1>
              <p className="text-sm text-center text-muted-foreground lg:text-left">
                Acompanhe os items da proforma neste campo com cálculos em tempo
                real
              </p>
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
    <div className="flex items-start justify-start">
    <ProductCards />
    </div>
    </div>
  );
}