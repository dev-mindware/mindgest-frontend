"use client";
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu as DropdownMenuPrimitive,
  Button,
  Icon,
} from "@/components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
  id: string;
  route: string;
  primaryAction?: string;
  secondaryAction?: string;
  handlerPrimaryAction?: () => void;
  handlerSecondaryAction?: () => void;
};

export function ButtonActionLink({
  id,
  route,
  primaryAction,
  secondaryAction,
  handlerPrimaryAction,
  handlerSecondaryAction,
}: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as
    | "technician"
    | "department chair"
    | "industrial"

  const getDetailsPath = () => {
    if (!category) return `${route}/${id}`;

    return {
      pathname: `/${"dssd"}/users/${id}`,
      query: { category },
    };
  };

  return (
    <DropdownMenuPrimitive>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-gray-100"
        >
          <Icon name="Ellipsis" className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-max">
        <DropdownMenuGroup>
          {primaryAction && (
            <DropdownMenuItem
              className="cursor-pointer rounded-md"
              onClick={handlerPrimaryAction}
            >
              <Icon name="CheckCheck" className="h-4 w-4 text-gray-500" />
              <span>{primaryAction}</span>
            </DropdownMenuItem>
          )}
          {handlerSecondaryAction && (
            <DropdownMenuItem
              className="cursor-pointer rounded-md"
              onClick={handlerSecondaryAction}
            >
              <Icon name="Ban" className="h-4 w-4 text-gray-500" />
              <span>{secondaryAction}</span>
            </DropdownMenuItem>
          )}
          <Link href={getDetailsPath()}>
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <Icon name="Eye" className="h-4 w-4 text-gray-500" />
              <span>Ver detalhes</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuPrimitive>
  );
}
