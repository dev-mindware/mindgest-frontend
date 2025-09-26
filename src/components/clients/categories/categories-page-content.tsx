"use client";
import { useModal } from "@/stores";
import { Button, TitleList } from "@/components";
import { AddCategoryModal, CategoriesList } from "@/components/categories";

export function CategoriesPageContent() {
  const { openModal } = useModal();

  return (
    <div className="space-y-6">
      <TitleList title="Categorias" suTitle="Faça a Gestão das Categorias.">
        <Button onClick={() => openModal("add-category")}>
          Nova Categoria
        </Button>
      </TitleList>

      <CategoriesList />
      <AddCategoryModal />
    </div>
  );
}
