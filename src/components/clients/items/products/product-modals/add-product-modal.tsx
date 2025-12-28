"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  Textarea,
  TsunamiOnly,
  GlobalModal,
  RHFSelect,
  RequestError,
  ButtonSubmit,
  CategoryModal,
  ProductModalSkeleton,
} from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { ItemFormData, itemSchema } from "@/schemas";
import { formatCurrency, parseCurrency } from "@/utils";
import { useAddItem, useGetCategories } from "@/hooks";
import { ErrorMessage } from "@/utils/messages";
import { useAuth } from "@/hooks/auth";

export function AddProductModal() {
  const { user } = useAuth();
  const { closeModal, openModal, open } = useModal();
  const { mutateAsync: addItemMutate, isPending } = useAddItem();
  const { categories, isLoading, error, refetch } = useGetCategories();
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      price: 0,
      cost: 0,
      companyId: String(user?.company?.id),
      type: "PRODUCT",
    },
  });

  async function onSubmit(data: ItemFormData) {
    try {
      await addItemMutate(data);
      reset();
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(
          error?.response?.data?.message ||
            "Ocorreu um erro ao adicionar o item"
        );
      } else {
        ErrorMessage("Ocorreu um erro desconhecido. Tente novamente");
      }
    }
  }

  const handleCancel = () => {
    reset();
    closeModal("add-product");
  };

  return (
    <GlobalModal
      canClose
      id="add-product"
      title={
        <div className="w-full flex items-center justify-between gap-2 mb-4">
          <span>Adicionar Producto</span>
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
      {isLoading ? (
        <ProductModalSkeleton />
      ) : error ? (
        <RequestError
          refetch={refetch}
          message="Ocorreu um erro ao carregar as categorias"
        />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 sm:grid-flow-col sm:auto-cols-fr"
        >
          <TsunamiOnly>
            <div className="space-y-6">
              <div className="rounded-lg bg-sidebar">
                <div className="p-6">
                  <h3 className="mb-4 font-semibold">Código de Barras</h3>
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-16 bg-black"></div>
                      ))}
                    </div>
                  </div>
                  <Input
                    id="barcode"
                    label="Código de Barras"
                    {...register("barcode")}
                    error={errors.barcode?.message}
                  />
                </div>
              </div>
            </div>
          </TsunamiOnly>

          <div className="">
            {/* <h3 className="my-4 font-semibold">Informação Geral</h3> */}
            <div className="space-y-4 sm:w-[35rem]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Nome"
                  startIcon="Tag"
                  {...register("name")}
                  error={errors.name?.message}
                  placeholder="Ex: Teclado Logitech"
                />
                <Input
                  label="SKU"
                  startIcon="Barcode"
                  {...register("sku")}
                  error={errors.sku?.message}
                  placeholder="Ex: SKU-12345"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="price"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      startIcon="Coins"
                      label="Preço de Venda"
                      placeholder="Ex: 10.00"
                      value={formatCurrency(value)}
                      onChange={(e) => onChange(parseCurrency(e.target.value))}
                      error={errors.price?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="cost"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      startIcon="Coins"
                      label="Custo de Compra"
                      placeholder="Ex: 10.000"
                      value={formatCurrency(value)}
                      onChange={(e) => onChange(parseCurrency(e.target.value))}
                      error={errors.cost?.message}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RHFSelect
                  name="categoryId"
                  label="Categoria"
                  options={categories}
                  control={control}
                />
                <RHFSelect
                  name="type"
                  label="Tipo"
                  options={[{ label: "Produto", value: "PRODUCT" }]}
                  control={control}
                />
              </div>

              <TsunamiOnly className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    startIcon="Scale"
                    type="quantity"
                    label="Stock Mínimo"
                    {...register("minStock", { valueAsNumber: true })}
                    error={errors.minStock?.message}
                  />
                  <Input
                    type="quantity"
                    startIcon="Scale"
                    label="Stock Máximo"
                    {...register("maxStock", { valueAsNumber: true })}
                    error={errors.maxStock?.message}
                  />
                  <Input
                    startIcon="Scale"
                    label="Unidade de Medida"
                    {...register("unit")}
                    error={errors.unit?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    startIcon="Weight"
                    label="Peso (Kg)"
                    {...register("weight", { valueAsNumber: true })}
                    error={errors.weight?.message}
                  />
                  <Input
                    label="Dimensões"
                    placeholder="Ex: 10x20x30 cm"
                    {...register("dimensions")}
                    error={errors.dimensions?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Data de Validade"
                    {...register("expiryDate")}
                    error={errors.expiryDate?.message}
                  />
                  <Input
                    type="number"
                    label="Dias até Expirar"
                    {...register("daysToExpiry", { valueAsNumber: true })}
                    error={errors.daysToExpiry?.message}
                  />
                </div>

                <Textarea
                  label="Descrição"
                  {...register("description")}
                  className="mt-1 min-h-[100px]"
                  placeholder="Escreva detalhes do item..."
                  error={errors.description?.message}
                />
              </TsunamiOnly>
            </div>

            <div className="flex justify-end gap-4 mt-5">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <ButtonSubmit
                className="w-max"
                isLoading={isPending || isSubmitting}
              >
                Salvar
              </ButtonSubmit>
            </div>
          </div>
        </form>
      )}
      {open["add-category"] && <CategoryModal action="add" />}
    </GlobalModal>
  );
}
