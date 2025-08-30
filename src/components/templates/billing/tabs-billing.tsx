"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsBilling() {
  return (
    <div>
      <Tabs defaultValue="tab-1">
        <div className="flex flex-col w-full gap-6">

          <div className="flex justify-center ">
            <div className="w-full px-4 sm:px-0">
              <TabsContent value="tab-1" className="mt-6 lg:mt-0">
                <h1 className="mb-2 text-xl text-center sm:text-2xl text-foreground">
                  Template da Fatura
                </h1>
                <p className="text-sm text-center text-muted-foreground">
                  Acompanhe os items da fatura neste campo com cálculos em tempo
                  real
                </p>
              </TabsContent>

              <TabsContent value="tab-2" className="mt-6 rounded-md lg:mt-0">
                <h1 className="mb-2 text-xl text-center sm:text-2xl text-foreground ">
                  Template do Recibo
                </h1>
                <p className="text-sm text-center text-muted-foreground ">
                  Acompanhe os items do recibo neste campo com cálculos em tempo
                  real
                </p>
              </TabsContent>

              <TabsContent value="tab-3" className="mt-6 lg:mt-0">
                <h1 className="mb-2 text-xl text-center sm:text-2xl text-foreground ">
                  Template da Proforma
                </h1>
                <p className="text-sm text-center text-muted-foreground ">
                  Acompanhe os items da proforma neste campo com cálculos em
                  tempo real
                </p>
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
