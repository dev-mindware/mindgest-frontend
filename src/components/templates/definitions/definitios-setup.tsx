import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Icon } from "@/components"
import { Appearance } from "./contents/appearance"
export function DefSetup() {
  return( 
  <div>
        <h1 className="text-2xl font-semibold">Definições da Conta</h1>
    <div className="hidden md:block">
    <Tabs
      defaultValue="tab-1"
      className="flex-row w-full mt-5"
    >
        <div className="h-screen bg-sidebar">
      <TabsList className="top-0 flex-col gap-1 px-1 font-normal bg-transparent rounded-none w-75 text-foreground">
        <div className="p-4 space-y-5">
            <p className="text-sm text-muted-foreground">Definições Gerais</p>
            <div>
        <TabsTrigger
          value="tab-1"
          className="hover:bg-accent hover:text-foreground  data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon 
            name="Pencil"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <p className="font-normal">Aparência</p>
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon
            name="User"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <p className="font-normal">Perfil</p>
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon
            name="Bell"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <p className="font-normal">Notificações</p>
        </TabsTrigger>
            </div>
            <div className="h-px bg-border"/>
            <p className="text-sm text-muted-foreground">Definições de Ambiente de Trabalho</p>
            <div>
        <TabsTrigger
          value="tab-4"
          className="hover:bg-accent hover:text-foreground  data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon
            name="Users"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <p className="font-normal">Entidades</p>
        </TabsTrigger>
        <TabsTrigger
          value="tab-5"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon
            name="BriefcaseBusiness"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <p className="font-normal">Colaboradores</p>
        </TabsTrigger>
        <TabsTrigger
          value="tab-6"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon
            name="Sparkles"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <p className="font-normal">Subscrição</p>
        </TabsTrigger>
            </div>
        </div>
      </TabsList>
      </div>
      <div className="border rounded-md grow text-start">
        <TabsContent value="tab-1">
            <Appearance/>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="px-4 py-3 text-xs text-muted-foreground">
            Content for Tab 2
          </p>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="px-4 py-3 text-xs text-muted-foreground">
            Content for Tab 3
          </p>
        </TabsContent>
        <TabsContent value="tab-4">
          <p className="px-4 py-3 text-xs text-muted-foreground">
            Content for Tab 4
          </p>
        </TabsContent>
        <TabsContent value="tab-5">
          <p className="px-4 py-3 text-xs text-muted-foreground">
            Content for Tab 5
          </p>
        </TabsContent>
        <TabsContent value="tab-6">
          <p className="px-4 py-3 text-xs text-muted-foreground">
            Content for Tab 6
          </p>
        </TabsContent>
      </div>
    </Tabs>
    </div>

    <div className="block mt-10 md:hidden">
        <Tabs defaultValue="tab-1" className="items-center">
      <TabsList className="h-auto p-0 -space-x-px shadow-xs bg-background rtl:space-x-reverse">
        <TabsTrigger
          value="tab-1"
          className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
        >
          <Icon 
            name="Pencil"
            size={16}
            aria-hidden="true"
          />
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
        >
          <Icon
            name="User"
            size={16}
            aria-hidden="true"
          />
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
        >
          <Icon
            name="Bell"
            size={16}
            aria-hidden="true"
          />
        </TabsTrigger>
        <TabsTrigger
          value="tab-4"
          className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
        >
          <Icon
            name="Users"
            size={16}
            aria-hidden="true"
          />
        </TabsTrigger>
        <TabsTrigger
          value="tab-5"
          className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
        >
        <Icon
            name="BriefcaseBusiness"
            size={16}
            aria-hidden="true"
          />
        </TabsTrigger>
        <TabsTrigger
          value="tab-6"
          className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
        >
          <Icon
            name="Sparkles"
            size={16}
            aria-hidden="true"
          />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1">
        <Appearance/>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="p-4 text-xs text-center text-muted-foreground">
          Content for Tab 2
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="p-4 text-xs text-center text-muted-foreground">
          Content for Tab 3
        </p>
      </TabsContent>
      <TabsContent value="tab-4">
        <p className="p-4 text-xs text-center text-muted-foreground">
          Content for Tab 4
        </p>
      </TabsContent>
      <TabsContent value="tab-5">
        <p className="p-4 text-xs text-center text-muted-foreground">
          Content for Tab 5
        </p>
      </TabsContent>
      <TabsContent value="tab-6">
        <p className="p-4 text-xs text-center text-muted-foreground">
          Content for Tab 6
        </p>
      </TabsContent>
    </Tabs>
    </div>
    </div>
  )
}