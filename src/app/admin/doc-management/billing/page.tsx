import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components"

const Page = () => {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Gestão de Documentos
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Faturação</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
                </div>
              </header>
        <div className="flex flex-col flex-1">
                  <div className="@container/main flex flex-1 p-4 flex-col gap-2">
                 
<Tabs defaultValue="tab-1">
  {/* Tabs List na esquerda */}
  <TabsList>
    <TabsTrigger value="tab-1">Fatura Normal</TabsTrigger>
    <TabsTrigger value="tab-2">Fatura Recibo</TabsTrigger>
    <TabsTrigger value="tab-3">Fatura Proforma</TabsTrigger>
  </TabsList>

  {/* Conteúdo sempre à direita */}
  <div className="flex justify-end flex-1">
    <div className="w-full max-w-md">
      <TabsContent value="tab-1" className="p-6 rounded-md shadow-md bg-primary">
        <p className="text-sm text-right text-muted-foreground">Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab-2" className="p-6 rounded-md shadow-md bg-primary">
        <p className="text-sm text-right text-muted-foreground">Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab-3" className="p-6 rounded-md shadow-md bg-primary">
        <p className="text-sm text-right text-muted-foreground">Content for Tab 3</p>
      </TabsContent>
    </div>
  </div>
</Tabs>

                      
                    </div>
                  </div>
                </div>    
  )
}

export default Page
