"use client"
import React from 'react'
import { AddProduct, DinamicBreadcrumb, Separator, SidebarTrigger, Tabs, TabsList, TabsTrigger, TabsContent, ProductList, Button, ServiceList } from "@/components";
import { useModal } from "@/stores";
export function Items() {
  const { openModal } = useModal();
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DinamicBreadcrumb
            showSeparator={false}
            subRoute="Items"
          />
        </div>
      </header>
      <div className="flex flex-col flex-1">
        <div className="@container/main flex flex-1 p-4 flex-col gap-2">
          <Tabs defaultValue="tab-1">
            <div className="flex flex-col w-full gap-6">
              <div className="w-full lg:w-auto">
                <h1 className="mb-4 text-xl text-center sm:text-2xl text-foreground lg:text-left">
                  Alterne entre os tipos de Items
                </h1>
                <div className="flex justify-center lg:justify-start">
                  <TabsList>
                    <TabsTrigger value="tab-1">Produtos</TabsTrigger>
                    <TabsTrigger value="tab-2">Serviços</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="flex justify-center ">
                <div className="w-full px-4 sm:px-0">
                  <TabsContent value="tab-1" className="mt-6 lg:mt-0">
                    <h1 className="mb-2 text-xl text-center sm:text-2xl text-foreground">
                      Faça a Gestão dos seus Produtos
                    </h1>
                    <p className="text-sm text-center text-muted-foreground">
                      Nesta área tens acesso aos produtos listados, faça a gestão em tempo real.
                    </p>
                    <Separator className="my-4" />
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={() => openModal("add-product")}
                        className="hidden md:block"
                      >
                        Novo Produto
                      </Button>
                    </div>
                    <ProductList />
                  </TabsContent>

                  <TabsContent value="tab-2" className="mt-6 rounded-md lg:mt-0">
                    <h1 className="mb-2 text-xl text-center sm:text-2xl text-foreground ">
                      Faça a Gestão dos seus Serviços
                    </h1>
                    <p className="text-sm text-center text-muted-foreground ">
                      Nesta área tens acesso aos serviços listados, faça a gestão em tempo real.
                    </p>
                    <Separator className="my-4" />
                    <div className="flex justify-end mb-4">
                      <Button>Novo Serviço</Button>
                    </div>
                    <ServiceList />
                  </TabsContent>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      <AddProduct />
    </div>
  )
}
