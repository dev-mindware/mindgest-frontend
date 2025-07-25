import { ReactNode } from "react";
import { Button } from "./button";
import { Icon } from "../layout";

type Props = {
  isLoading: boolean;
  children?: ReactNode;
  className?: string;
};

export function ButtonSubmit({ isLoading, children, className }: Props) {
  return (
    <Button
      disabled={isLoading}
      type="submit"
      className={`w-full bg-primary hover:bg-[#8B4CF0] text-white py-2 ${className}`}
    >
      {isLoading && <Icon className="animate-spin" name="LoaderCircle" />}
      {children}
    </Button>
  );
}