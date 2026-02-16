"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { measurement, status } from "./constant-data";
import { currentProductStore } from "@/stores";
import {
  Button,
  GlobalModal,
  Textarea,
  Label,
  Input,
  ProOnly,
  RHFSelect,
  CategoryModal,
  ButtonSubmit,
  ProductModalSkeleton,
  RequestError,
  InputCurrency,
} from "@/components";
import { useModal } from "@/stores/modal/use-modal-store";
import { AddProductFormData, addProductSchema } from "@/schemas";
import { formatCurrency, parseCurrency } from "@/utils";
import { useUpdateItem } from "@/hooks/items";
import { ErrorMessage } from "@/utils/messages";
import { useGetCategories } from "@/hooks";

export function EditProductModal() {
  const { closeModal, open, openModal } = useModal();
  const isOpen = open["edit-product"];
  const { currentProduct } = currentProductStore();
  const { mutateAsync: updatedProdut, isPending } = useUpdateItem();
  const { categoryOptions, isLoading, error, refetch } = useGetCategories();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      stock: 1,
      selectedStatus: "ACTIVE",
      price: 0,
    },
  });

  async function onSubmit(data: AddProductFormData) {
    try {
      if (!currentProduct) return;

      const finalPayload = {
        name: data.name,
        sku: data.sku,
        categoryId: data.selectedCategory,
        price: data.price,
      };

      await updatedProdut({
        id: currentProduct.id,
        data: finalPayload,
      });

      handleCancel();
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(
          error?.response?.data?.message || "Erro ao actualizar o produto"
        );
      } else {
        ErrorMessage("Ocorreu um erro ao atualizar o produto");
      }
    }
  }

  const handleCancel = () => {
    reset();
    closeModal("edit-product");
  };

  if (!isOpen) return null;

  return (
    <GlobalModal
      canClose
      id="edit-product"
      title={
        <div className="w-full flex items-center justify-between gap-2 mb-4">
          <span>Editar Produto</span>
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
          <ProOnly>
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

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Adicionar Novo
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      Selecionar código existente
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ProOnly>

          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Informação Geral</h3>
            </div>
            <div className="space-y-4 sm:w-[35rem]">
              <div className="w-full">
                <Input
                  className="mt-1"
                  id="product-name"
                  {...register("name")}
                  startIcon="User"
                  label="Nome do Produto"
                  placeholder="Escreva aqui..."
                  error={errors.name?.message}
                  defaultValue={currentProduct?.name}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <RHFSelect
                  name="selectedCategory"
                  options={categoryOptions}
                  control={control}
                  label="Categoria"
                />

                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <InputCurrency
                      ref={field.ref}
                      label="Preço de Venda"
                      placeholder="0,00"
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      error={errors.price?.message}
                    />
                  )}
                />

              </div>

              <ProOnly className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    id="supplier"
                    className="mt-1"
                    startIcon="Truck"
                    {...register("supplier")}
                    label="Fornecedor Padrão"
                    placeholder="Escreva aqui..."
                    error={errors.supplier?.message}
                  />
                  <Input
                    id="location"
                    className="mt-1"
                    startIcon="MapPin"
                    {...register("location")}
                    placeholder="Escreva aqui..."
                    error={errors.location?.message}
                    label="Armazém ou Localização Física"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    type="quantity"
                    id="daily-sales"
                    label="Venda Por Dia"
                    className="text-center"
                    error={errors.salesPerDay?.message}
                    {...register("salesPerDay", { valueAsNumber: true })}
                  />
                  <Input
                    type="quantity"
                    id="stock-initial"
                    label="Stock Inicial"
                    className="text-center"
                    error={errors.stock?.message}
                    {...register("stock", { valueAsNumber: true })}
                  />
                  <Input
                    type="quantity"
                    id="stock-minimum"
                    label="Stock Mínimo"
                    className="text-center"
                    error={errors.minStock?.message}
                    {...register("minStock", { valueAsNumber: true })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    type="date"
                    id="expiration-date"
                    label="Data de Validade"
                    className="text-center"
                    {...register("expiryDate", { valueAsDate: true })}
                    error={errors.expiryDate?.message}
                  />
                  <div>
                    <div className="relative mt-1">
                      <Input
                        type="quantity"
                        id="restock-time"
                        className="text-center"
                        label="Tempo Médio de Reposição"
                        error={errors.repositionTime?.message}
                        {...register("repositionTime", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                  <Input
                    id="warranty"
                    type="quantity"
                    label="Garantia"
                    className="text-center"
                    error={errors.warranty?.message}
                    {...register("warranty", { valueAsNumber: true })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    id="tax"
                    type="number"
                    label="Imposto"
                    placeholder="0.00"
                    startIcon="Percent"
                    error={errors.tax?.message}
                    {...register("tax", { valueAsNumber: true })}
                  />
                  <RHFSelect
                    name="selectedMeasurement"
                    options={measurement}
                    control={control}
                    label="Tipo de Medida"
                  />
                  <RHFSelect
                    name="selectedStatus"
                    options={status}
                    control={control}
                    label="Estado do Produto"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Text"
                    className="mt-1 min-h-[100px]"
                    {...register("description")}
                  />
                </div>
              </ProOnly>
            </div>
            <div className="flex mt-6 justify-end gap-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <ButtonSubmit className="w-max" isLoading={isPending}>
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
