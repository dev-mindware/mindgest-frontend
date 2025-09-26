"use client";
import { Category } from "@/types";
import { Icon } from "@/components";
import { formatDateTime } from "@/utils";
import { Card, CardContent, CardHeader, Button } from "@/components";

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onView?: (category: Category) => void;
}

export function CategoryCardView({
  category,
  onEdit,
  onDelete,
  onView,
}: CategoryCardProps) {
  return (
    <Card className="relative overflow-hidden transition-shadow duration-200 border border-border bg-card hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Icon name="Tag" className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                Criado em {formatDateTime(category.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {onView && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onView(category)}
              >
                <Icon name="Eye" className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(category)}
              >
                <Icon name="Pencil" className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => onDelete(category)}
              >
                <Icon name="Trash" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {category.description && (
          <p className="text-sm text-muted-foreground">
            {category.description.length > 40
              ? category.description.substring(0, 35) + "..."
              : category.description}
          </p>
        )}
        <p className="text-xs">
          Status:{" "}
          <span
            className={`font-medium ${
              category.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {category.isActive ? "Ativa" : "Inativa"}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          Última atualização: {formatDateTime(category.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );
}
