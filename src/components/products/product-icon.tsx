import { Icon } from "../common";

interface ProductIconProps {
  className?: string;
}

export const ProductIcon = ({ className = "w-6 h-6 text-primary" }: ProductIconProps) => (
  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10">
    <Icon name="Package" className={className} />
  </div>
);