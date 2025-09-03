import { Product } from "@/types";
import { TsunamiOnly } from "../common";

export const ProductDetails = ({ product }: { product: Product }) => (
  <TsunamiOnly>
    <div className="flex items-center gap-2 text-muted-foreground">
      <ProductInfoChip>{product.category}</ProductInfoChip>
      <ProductInfoChip>{product.measurement}</ProductInfoChip>
      <ProductInfoChip>{product.warranty} dias de garantia</ProductInfoChip>
    </div>
  </TsunamiOnly>
);

interface ProductInfoChipProps {
  children: React.ReactNode;
}

const ProductInfoChip = ({ children }: ProductInfoChipProps) => (
  <span className="px-2 py-1 rounded-md bg-muted text-xs">
    {children}
  </span>
);