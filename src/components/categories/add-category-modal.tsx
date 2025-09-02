"use client";
import {
  Input,
  Button,
  GlobalModal,
  TsunamiOnly,
  FileImageUpload,
} from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormData, categorySchema } from "@/schemas";
import { useModal } from "@/stores";

export function AddCategoryModal() {
  const { closeModal } = useModal();
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: CategoryFormData) {
    console.log(data);
  }

  return (
    <GlobalModal
      canClose
      id="add-category"
      title="Adicionar Categoria"
      className="!max-w-md !w-[90vw] md:!w-full"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 overflow-auto max-h-[80vh]"
      >
        <Input
          label="Nome"
          placeholder="Ex: Plásticos, Cosméticos..."
          {...form.register("name")}
          error={form.formState.errors?.name?.message}
        />

        <Input
          label="Código de Abreviação"
          placeholder="Ex: PLSTC, CMTC"
          {...form.register("abbreviation")}
          error={form.formState.errors?.abbreviation?.message}
        />

        <TsunamiOnly>
          <div>
            <FileImageUpload
              name="icon"
              label="Icone"
              control={form.control}
              info="Imagem do icone"
            />
          </div>
        </TsunamiOnly>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            className="px-6"
            onClick={() => closeModal("add-category")}
          >
            Cancelar
          </Button>
          <Button disabled={form.formState.isSubmitting} className="">
            Salvar
          </Button>
        </div>
      </form>
    </GlobalModal>
  );
}
