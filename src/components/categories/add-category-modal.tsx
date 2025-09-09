"use client";
import { Input, Button, GlobalModal, Label, Textarea } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormData, categorySchema } from "@/schemas";
import { useModal } from "@/stores";

export function AddCategoryModal() {
  const { closeModal } = useModal();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onChange", 
  });

  async function onSubmit(data: CategoryFormData) {
    console.log("Categoria criada:", data);
    alert(JSON.stringify(data, null, 2));
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
          placeholder="Ex: Plásticos, Cosméticos..."
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Código de Abreviação"
          placeholder="Ex: PLSTC, CMTC"
          {...register("abbreviation")}
          error={errors.abbreviation?.message}
        />
        <Label>Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Escreva aqui..."
            />
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            className="px-6"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="px-6"
          >
            Salvar
          </Button>
        </div>
      </form>
    </GlobalModal>
  );
}
