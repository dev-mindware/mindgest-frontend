"use client";
import { useModal } from "@/stores";
import { useForm } from "react-hook-form";
import { useCategory } from "@/hooks/category";
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

export function AddCategoryModal() {
  const { closeModal } = useModal();
  const { mutateAsync: addCategory, isPending } = useCategory();
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
      await addCategory(data);
      reset();
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(
          error?.response?.data?.message ||
            "Ocorreu um erro ao adicionar a categoria"
        );
      } else {
        ErrorMessage("Ocorreu um erro desconhecido. Tente novamente");
      }
    }
  }

  const handleCancel = () => {
    reset();
    closeModal("add-category");
  };

  return (
    <GlobalModal
      canClose
      id="add-category"
      title="Adicionar Categoria"
      className="!max-w-md !w-[90vw] md:!w-full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 overflow-auto max-h-[80vh]"
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
          <ButtonSubmit className="w-max" isLoading={isPending || isSubmitting}>
            Adicionar
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
