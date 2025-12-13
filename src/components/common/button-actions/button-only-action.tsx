import { Icon } from "../icon";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

type Action<T> = {
  label: string;
  onClick: (data: T) => void;
  className?: string;
};

type Props<T> = {
  data: T;
  actions: Action<T>[];
};

export function ButtonOnlyAction<T>({ data, actions }: Props<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full shadow-none"
          aria-label="Open actions menu"
        >
          <Icon name="Ellipsis" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={action.label + index} // Using label + index for a simple unique key
            onClick={() => action.onClick(data)}
            className={action.className}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
