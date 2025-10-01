"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  GlobalModal,
  Textarea,
  Input,
  RHFSelect,
  RequestError,
  ButtonSubmit,
  CategoryModal,
} from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { ItemFormData, itemSchema } from "@/schemas";
import { formatCurrency, parseCurrency } from "@/utils";
import { useAddItem, useGetCategories } from "@/hooks";
import { currentServiceStore } from "@/stores";
import { useAuth } from "@/hooks/auth";
import { ErrorMessage } from "@/utils/messages";

type ServiceModalProps = {
  action: "add" | "edit";
};

export function ServiceModal({ action }: ServiceModalProps) {
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();
  const { currentService } = currentServiceStore();
  const { mutateAsync: addItemMutate, isPending } = useAddItem();
  const { categories, isLoading, error, refetch } = useGetCategories();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      type: "SERVICE",
      sku: action === "edit" ? currentService?.sku : "",
      name: action === "edit" ? currentService?.name : "",
      price: action === "edit" ? currentService?.price : 0,
      cost: action === "edit" ? currentService?.price : 1,
      description: action === "edit" ? currentService?.description : "",
      categoryId: action === "edit" ? currentService?.categoryId : "",
      companyId: String(user?.company?.id),
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    if (action === "add") {
      try {
        await addItemMutate(data);
        reset();
      } catch (error: any) {
        if (error?.response?.data?.message) {
          ErrorMessage(error?.response?.data?.message);
        }
      }
    } else {
      console.log("Editando serviço:", data);
    }
  }

  const handleCancel = () => {
    reset();
    closeModal(`${action}-service`);
  };

  if (isLoading) return <p>Carregando categorias...</p>;
  if (error)
    return (
      <RequestError
        refetch={refetch}
        message="Ocorreu um erro ao carregar as categorias"
      />
    );

  return (
    <GlobalModal
      canClose
      id={`${action}-service`}
      title={
        <div className="w-full flex items-center justify-between gap-2 mb-4">
          <span>
            {action === "add" ? "Adicionar Serviço" : "Editar Serviço"}
          </span>
          <Button
            size="sm"
            className="sticky right-0"
            variant="outline"
            onClick={() => openModal("add-category")}
          >
            Adicionar Categoria
          </Button>
        </div>
      }
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Informação Geral</h3>
          </div>
          <div className="space-y-4 sm:w-[35rem]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                className="mt-1"
                startIcon="User"
                id="service-name"
                {...register("name")}
                label="Nome do Serviço"
                placeholder="Escreva aqui..."
                error={errors.name?.message}
              />
              <Input
                label="SKU"
                startIcon="Barcode"
                {...register("sku")}
                error={errors.sku?.message}
                placeholder="Ex: SKU-12345"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <Input
                    id="price"
                    type="text"
                    startIcon="Coins"
                    label="Preço de Venda"
                    error={errors.price?.message}
                    value={formatCurrency(value)}
                    onChange={(e) => {
                      const rawNumber = parseCurrency(e.target.value);
                      onChange(rawNumber);
                    }}
                  />
                )}
              />
              <RHFSelect
                control={control}
                label="Categoria"
                options={categories}
                name="categoryId"
              />
            </div>

            <Textarea
              label="Descrição"
              id="description"
              {...register("description")}
              placeholder="Escreva aqui..."
              error={errors.description?.message}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isPending || isSubmitting}>
            Salvar
          </ButtonSubmit>
        </div>
      </form>
      <CategoryModal action="add" />
    </GlobalModal>
  );
}
