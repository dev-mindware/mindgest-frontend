import { useModal } from "@/stores/use-modal-store";
import { currentCategoryStore } from "@/stores";
import { Category } from "@/types";
import { useToggleStatusCategory } from "./use-category";

export function useCategoryActions() {
  const { openModal } = useModal();
  const { setCurrentCategory } = currentCategoryStore();
  const { mutateAsync: toggleStatus, isPending } = useToggleStatusCategory();

  function handlerEditCategory(category: Category) {
    openModal("edit-category");
    setCurrentCategory(category);
  }

  function handlerDetailsCategory(category: Category) {
    openModal("view-category");
    setCurrentCategory(category);
  }

  function handlerDeleteCategory(category: Category) {
    openModal("delete-category");
    setCurrentCategory(category);
  }

  async function toggleStatusCategory(category: Category) {
    setCurrentCategory(category);
    await toggleStatus(category.id);
  }


  return {
    handlerDeleteCategory,
    handlerDetailsCategory,
    handlerEditCategory,
    toggleStatusCategory,
  };
}
