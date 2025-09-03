"use client";
import Image from "next/image";
import Ai from "@/assets/AI.png";
import { useModal } from "@/stores/use-modal-store";
import { Button } from "@/components/ui";
import { AddProductModal, ProductList } from "@/components/products";
import { TitleList } from "@/components/common";

export function Management() {
  const { openModal } = useModal();

  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <TitleList
          title="Produtos"
          suTitle="Faça a gestão dos seus produtos aqui"
        />
        <Button
          onClick={() => openModal("add-product")}
          className="hidden md:block"
        >
          Novo Produto
        </Button>
      </div>
      <div className="flex items-center justify-center p-4 ">
        <Image
          src={Ai.src}
          alt="Image"
          width={100}
          height={100}
          className="animate-pulse"
        />
      </div>
      <ProductList size="large" />
      <AddProductModal />
    </div>
  );
}
