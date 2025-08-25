"use client";
import {
  Card,
  Icon,
  Button,
  Badge,
  CardContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  CardHeader,
} from "@/components";
import { useServiceActions } from "@/hooks";
import { Service } from "@/types";
import { formatPrice } from "@/utils";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCardView({ service }: ServiceCardProps) {
  const { handlerDeleteService, handlerDetailsService, handlerEditService } =
    useServiceActions();
  const truncateTitle = (title: string, maxLength: number = 23) => {
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  return (
    <Card className="relative overflow-hidden transition-shadow duration-200 border border-border bg-card hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10">
              <Icon name="Store" className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="text-sm font-semibold leading-tight truncate cursor-default text-foreground">
                    {truncateTitle(service.name)}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{service.name}</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                {service.category}
                </span>
                <Badge
                  variant="secondary"
                  className={
                    service.status === "Activo"
                      ? "text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : service.status === "Pendente"
                        ? "text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }
                >
                  {service.status}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full shadow-none"
              >
                <Icon name="Settings2" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handlerDetailsService(service)}>
                Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlerEditService(service)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handlerDeleteService(service)}
              >
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Preço do serviço</p>
          <p className="text-sm font-semibold text-foreground">
            {formatPrice(service.price)}
          </p>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
