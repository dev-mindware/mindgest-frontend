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
  handleSee?: (data: T) => void;
  handleEdit?: (data: T) => void;
  handleDelete?: (data: T) => void;
  auxAction?: (data: T) => void;
  auxActionLabel?: string;
  deleteLabel?: string;
  editLabel?: string;
  seeLabel?: string;
};

export function ButtonOnlyAction<T>({
  data,
  handleSee,
  handleEdit,
  handleDelete,
  auxAction,
  auxActionLabel,
  deleteLabel,
  editLabel,
  seeLabel
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
        {handleSee && (
          <DropdownMenuItem onClick={() => handleSee(data)}>
            {seeLabel || "Ver"}
          </DropdownMenuItem>
        )}
        {handleEdit && (
          <DropdownMenuItem onClick={() => handleEdit(data)}>
            {editLabel || "Editar"}
          </DropdownMenuItem>
        )}
        {auxAction && (
          <DropdownMenuItem onClick={() => auxAction(data)}>
            {auxActionLabel}
          </DropdownMenuItem>
        )}
        {handleDelete && (
          <DropdownMenuItem
            className="text-destructive hover:!bg-destructive/15 hover:!text-destructive"
            onClick={() => handleDelete(data)}
          >
            {deleteLabel || "Deletar"}
          </DropdownMenuItem>
        )}
       
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
