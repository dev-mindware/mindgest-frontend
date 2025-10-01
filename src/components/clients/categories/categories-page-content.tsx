import { TitleList } from "@/components";
import { AddCategoryModal, CategoriesList } from "@/components/categories";
import { ButtonAddCategory } from "./button-add-category";

export function CategoriesPageContent() {
  return (
    <div className="space-y-6">
      <TitleList title="Categorias" suTitle="Faça a Gestão das Categorias.">
        <ButtonAddCategory />
      </TitleList>

      <CategoriesList />
      <AddCategoryModal />
    </div>
  );
}
