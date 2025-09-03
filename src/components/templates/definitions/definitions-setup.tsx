import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@/components";
import { Appearance } from "./contents/appearance";
import { Profile } from "./contents/profile";
import { Notification } from "./contents/notifications";
import { Collaborators } from "./contents/collaborators";
import { Subscriptions } from "./contents/subscription";
import { EntitiesList } from "@/components/clients/entities";

interface DefSetupProps {
  disabledTabs?: string[];
}

export function DefSetup({ disabledTabs = [] }: DefSetupProps) {
  const tabs = [
    {
      id: "tab-1",
      label: "Aparência",
      icon: "Pencil",
      component: <Appearance />,
      category: "general",
    },
    {
      id: "tab-2",
      label: "Perfil",
      icon: "User",
      component: <Profile />,
      category: "general",
    },
    {
      id: "tab-3",
      label: "Notificações",
      icon: "Bell",
      component: <Notification />,
      category: "general",
    },
    {
      id: "tab-4",
      label: "Entidades",
      icon: "Users",
      component: <EntitiesList />,
      category: "workplace",
    },
    {
      id: "tab-5",
      label: "Colaboradores",
      icon: "BriefcaseBusiness",
      component: <Collaborators />,
      category: "workplace",
    },
    {
      id: "tab-6",
      label: "Subscrição",
      icon: "Sparkles",
      component: <Subscriptions />,
      category: "workplace",
    },
  ];

  const enabledTabs = tabs.filter((tab) => !disabledTabs.includes(tab.id));
  const generalTabs = enabledTabs.filter((tab) => tab.category === "general");
  const workplaceTabs = enabledTabs.filter(
    (tab) => tab.category === "workplace"
  );

  if (enabledTabs.length === 0) {
    return null;
  }

  const defaultTab = enabledTabs[0]?.id || "tab-1";

  const renderTabTrigger = (
    tab: (typeof tabs)[0],
    isDesktop: boolean = true
  ) => {
    const baseClasses = isDesktop
      ? "hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
      : "data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e";

    return (
      <TabsTrigger key={tab.id} value={tab.id} className={baseClasses}>
        <Icon
          name={
            tab.icon as
              | "User"
              | "Bell"
              | "Users"
              | "BriefcaseBusiness"
              | "Sparkles"
          }
          className={isDesktop ? "-ms-0.5 me-1.5 opacity-60" : ""}
          size={16}
          aria-hidden="true"
        />
        {isDesktop && <p className="font-normal">{tab.label}</p>}
      </TabsTrigger>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Definições da Conta</h1>

      <div className="hidden md:block">
        <Tabs defaultValue={defaultTab} className="flex-row w-full mt-5 ">
          <div className="h-screen bg-sidebar">
            <TabsList className="sticky top-0 flex-col gap-1 px-1 font-normal bg-transparent rounded-none w-75 text-foreground">
              <div className="p-4 space-y-5">
                {generalTabs.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Definições Gerais
                    </p>
                    <div>
                      {generalTabs.map((tab) => renderTabTrigger(tab, true))}
                    </div>
                  </>
                )}

                {generalTabs.length > 0 && workplaceTabs.length > 0 && (
                  <div className="h-px bg-border" />
                )}

                {workplaceTabs.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Definições de Ambiente de Trabalho
                    </p>
                    <div>
                      {workplaceTabs.map((tab) => renderTabTrigger(tab, true))}
                    </div>
                  </>
                )}
              </div>
            </TabsList>
          </div>

          <div className="border rounded-md grow text-start">
            {enabledTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.component}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      <div className="block mt-10 md:hidden">
        <Tabs defaultValue={defaultTab} className="items-center">
          <TabsList className="h-auto p-0 -space-x-px shadow-xs bg-background rtl:space-x-reverse">
            {enabledTabs.map((tab) => renderTabTrigger(tab, false))}
          </TabsList>

          {enabledTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
