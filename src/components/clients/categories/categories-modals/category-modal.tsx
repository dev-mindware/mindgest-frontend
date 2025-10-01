"use client";
import { currentCategoryStore, useModal } from "@/stores";
import { useForm } from "react-hook-form";
import { useAddCategory, useUpdateCategory } from "@/hooks/category";
import { ErrorMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormData, categorySchema } from "@/schemas";
import {
  Input,
  Button,
  Textarea,
  ButtonSubmit,
  GlobalModal,
} from "@/components";

type CategoryModalProps = {
  action: "add" | "edit";
};

export function CategoryModal({ action }: CategoryModalProps) {
  const { closeModal } = useModal();
  const { currentCategory } = currentCategoryStore();
  const { mutateAsync: addCategory, isPending: isAdding } = useAddCategory();
  const { mutateAsync: editCategory, isPending: isEditing } = useUpdateCategory();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: currentCategory ?? { name: "", description: "" },
  });

  async function onSubmit(data: CategoryFormData) {
    try {
      if (action === "add") {
        await addCategory(data);
      } else if (action === "edit" && currentCategory?.id) {
        await editCategory({ id: currentCategory.id, data });
      }
      reset();
      closeModal(`${action}-category`);
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(
          error?.response?.data?.message ||
            "Ocorreu um erro ao salvar a categoria"
        );
      } else {
        ErrorMessage("Ocorreu um erro desconhecido. Tente novamente");
      }
    }
  }

  const handleCancel = () => {
    reset();
    closeModal(`${action}-category`);
  };

  const isPending = isAdding || isEditing || isSubmitting;
  const modalTitle = action === "add" ? "Adicionar Categoria" : "Editar Categoria";
  const submitLabel = action === "add" ? "Adicionar" : "Salvar alterações";

  return (
    <GlobalModal
      canClose
      id={`${action}-category`}
      title={modalTitle}
      className="!max-w-md !w-[90vw] md:!w-full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 overflow-auto"
      >
        <Input
          label="Nome"
          startIcon="Tag"
          placeholder="Ex: Plásticos, Cosméticos..."
          {...register("name")}
          error={errors.name?.message}
        />

        <Textarea
          label="Descrição"
          id="description"
          {...register("description")}
          placeholder="Escreva aqui..."
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            className="w-max"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isPending}>
            {submitLabel}
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
