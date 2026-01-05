import { TitleList } from "@/components";
import { ButtonAddCategory } from "./button-add-category";
import { CategoriesList } from "./categories-list";
import { CategoryModal } from "./categories-modals";

export function CategoriesPageContent() {
  return (
    <div className="space-y-6">
      <TitleList title="Categorias" suTitle="Faça a Gestão das Categorias.">
        <ButtonAddCategory />
      </TitleList>

      <CategoriesList />
      <CategoryModal action="add" />
    </div>
  );
}
