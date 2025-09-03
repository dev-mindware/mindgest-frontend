"use client";
import {
  Icon,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ButtonOnlyAction,
} from "@/components";
import { Service, OrderItem } from "@/types";
import { formatPrice } from "@/utils/format-price";
import { useServiceActions } from "@/hooks";

interface ServiceTableProps {
  services: Service[];
  onAddToOrder?: (item: OrderItem) => void;
}

export function ServiceTableView({
  services,
  onAddToOrder,
}: ServiceTableProps) {
  const { handlerDeleteService, handlerDetailsService, handlerEditService } =
    useServiceActions();

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>{formatPrice(service.price)}</TableCell>

              <TableCell>
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
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {onAddToOrder && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-primary/10"
                      onClick={() =>
                        onAddToOrder({
                          id: service.id,
                          title: service.name,
                          price: service.price,
                          quantity: 1,
                        })
                      }
                      title="Adicionar ao template"
                    >
                      <Icon name="Plus" className="w-4 h-4 text-primary" />
                    </Button>
                  )}
                  <ButtonOnlyAction
                    data={service}
                    handleDelete={handlerDeleteService}
                    handleEdit={handlerEditService}
                    handleSee={handlerDetailsService}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
