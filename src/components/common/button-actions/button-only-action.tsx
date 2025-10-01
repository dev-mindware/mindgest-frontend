import { Icon } from "../icon";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

type Props<T> = {
  data: T;
  handleSee: (data: T) => void;
  handleEdit: (data: T) => void;
  handleDelete: (data: T) => void;
  auxAction?: (data: T) => void;
  auxActionLabel?: string;
};

export function ButtonOnlyAction<T>({
  data,
  handleSee,
  handleEdit,
  handleDelete,
  auxAction,
  auxActionLabel
}: Props<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full shadow-none"
          aria-label="Open edit menu"
        >
          <Icon name="Ellipsis" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSee(data)}>
          Detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEdit(data)}>
          Editar
        </DropdownMenuItem>
        {auxAction && (
          <DropdownMenuItem onClick={() => auxAction(data)}>
            {auxActionLabel}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => handleDelete(data)}
        >
          Deletar
        </DropdownMenuItem>
       
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
