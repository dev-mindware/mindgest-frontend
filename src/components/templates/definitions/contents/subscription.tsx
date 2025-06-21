"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui";

const subscriptions = [
  {
    id: 1,
    name: "Mindware – Comércio e Serviços",
    plan: "VIP",
    status: "Ativo",
    type: "Trimestral",
    expiration: "19/06/2025",
    progress: 85,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    planColor: "text-purple-600",
    badgeVariant: "default"
  },
  {
    id: 2,
    name: "TechFlow Solutions Ltda",
    plan: "Premium",
    status: "Ativo",
    type: "Anual",
    expiration: "15/12/2025",
    progress: 45,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    planColor: "text-blue-600",
    badgeVariant: "default"
  },
  {
    id: 3,
    name: "DataSync Consultoria",
    plan: "Básico",
    status: "Inativo",
    type: "Mensal",
    expiration: "02/05/2025",
    progress: 95,
    color: "bg-gradient-to-br from-gray-400 to-gray-500",
    planColor: "text-gray-600",
    badgeVariant: "secondary"
  },
  {
    id: 4,
    name: "CloudNet Empresarial",
    plan: "Enterprise",
    status: "Ativo",
    type: "Anual",
    expiration: "28/09/2025",
    progress: 62,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    planColor: "text-emerald-600",
    badgeVariant: "default"
  },
  {
    id: 5,
    name: "StartUp Innovations",
    plan: "Starter",
    status: "Em período experimental",
    type: "Experimental",
    expiration: "10/07/2025",
    progress: 15,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    planColor: "text-orange-600",
    badgeVariant: "outline"
  },
  {
    id: 6,
    name: "Global Trade Solutions",
    plan: "Professional",
    status: "Em Promoção",
    type: "Semestral",
    expiration: "22/08/2025",
    progress: 73,
    color: "bg-gradient-to-br from-pink-500 to-pink-600",
    planColor: "text-pink-600",
    badgeVariant: "outline"
  },
];

export function Subscriptions() {
  const [showMoreTabs, setShowMoreTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");

  const filterSubscriptions = (status: string) => {
    if (status === "todos") return subscriptions;
    if (status === "ativos") return subscriptions.filter(sub => sub.status === "Ativo");
    if (status === "inativos") return subscriptions.filter(sub => sub.status === "Inativo");
    if (status === "experimental") return subscriptions.filter(sub => sub.status === "Em período experimental");
    if (status === "promocao") return subscriptions.filter(sub => sub.status === "Em Promoção");
    return subscriptions;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Inativo":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Em período experimental":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Em Promoção":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mx-auto space-y-6 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl">Subscrição</h2>
            <p className="text-sm text-muted-foreground">
              Faça a gestão da subscrição dos usuários aqui
            </p>
          </div>
          <Button variant={"default"}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Subscrição
          </Button>
        </div>

        <Separator/>

        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="bg-transparent rounded-none">
              <TabsTrigger 
                value="todos"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-accent rounded-none pb-2"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger 
                value="ativos"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-accent rounded-none pb-2"
              >
                Ativos
              </TabsTrigger>
              <TabsTrigger 
                value="inativos"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-accent rounded-none pb-2"
              >
                Inativos
              </TabsTrigger>
              
              {showMoreTabs && (
                <>
                  <TabsTrigger 
                    value="experimental"
                    className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-accent rounded-none pb-2"
                  >
                    Em período experimental
                  </TabsTrigger>
                  <TabsTrigger 
                    value="promocao"
                    className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-accent rounded-none pb-2"
                  >
                    Em Promoção
                  </TabsTrigger>
                </>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreTabs(!showMoreTabs)}
                className="ml-4 text-foreground hover:text-primary"
              >
                {showMoreTabs ? "Ocultar" : "+ Ver"}
              </Button>
            </TabsList>
          </div>

          {["todos", "ativos", "inativos", "experimental", "promocao"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {filterSubscriptions(tabValue).map((sub) => (
                  <Card key={sub.id} className="relative overflow-hidden transition-all duration-200 border border-border bg-sidebar hover:border-primary">
                    <CardContent className="p-4">
                      {/* Header with Icon and Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          {/* Icon - Laptop with graduation cap */}
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-muted">
                            <div className="relative">
                              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {/* Graduation cap overlay */}
                              <div className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1"></div>
                            </div>
                          </div>
                          
                          {/* Company Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="mb-1 text-sm font-medium leading-tight text-foreground">
                              {sub.name}
                            </h3>
                            <p className={`text-xs font-medium ${sub.planColor} mb-2`}>
                              {sub.plan}
                            </p>
                            <Badge 
                              className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(sub.status)}`}
                            >
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                              {sub.status}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* More Options */}
                        <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-foreground hover:text-primary">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">Data de Expiração</p>
                          <p className="font-medium text-foreground">{sub.expiration}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">Tipo de Subscrição</p>
                          <p className="font-medium text-foreground">{sub.type}</p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">Progresso</p>
                          <p className="text-xs font-medium text-foreground">{sub.progress}%</p>
                        </div>
                        <Progress 
                          value={sub.progress} 
                          className="h-2 bg-muted"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filterSubscriptions(tabValue).length === 0 && (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhuma subscrição encontrada</h3>
                  <p className="text-gray-500">Não há subscrições nesta categoria no momento.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}