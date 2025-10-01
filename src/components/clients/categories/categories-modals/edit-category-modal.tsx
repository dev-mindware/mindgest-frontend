"use client";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { currentCategoryStore, useModal } from "@/stores";
import { CategoryFormData, categorySchema } from "@/schemas";
import { useUpdateCategory } from "@/hooks/category";
import {
  Input,
  Button,
  Textarea,
  ButtonSubmit,
  GlobalModal,
} from "@/components";

export function EditCategoryModal() {
  const { closeModal } = useModal();
  const { currentCategory } = currentCategoryStore();

  const { mutateAsync: editCategory, isPending: isEditing } =
    useUpdateCategory();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
  });

  async function onSubmit(data: CategoryFormData) {
    try {
      await editCategory({ id: currentCategory!.id, data });
      handleCancel();
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
    closeModal("edit-category");
  };

  if (!currentCategory) return null;

  return (
    <GlobalModal
      canClose
      title="Editar Categoria"
      id="edit-category"
      className="!max-w-md !w-[90vw] md:!w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nome"
          startIcon="Tag"
          placeholder="Ex: Plásticos, Cosméticos..."
          {...register("name")}
          error={errors?.name?.message}
          defaultValue={currentCategory?.name}
        />

        <Textarea
          label="Descrição"
          id="description"
          {...register("description")}
          placeholder="Escreva aqui..."
          defaultValue={currentCategory?.description}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-max"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isEditing || isSubmitting}>
            Salvar alterações
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
