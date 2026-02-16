"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  Textarea,
  ProOnly,
  GlobalModal,
  RHFSelect,
  RequestError,
  ButtonSubmit,
  CategoryModal,
  ProductModalSkeleton,
  FeatureGate,
  InputCurrency,
} from "@/components";
import { PaginatedSelect } from "@/components/shared";
import { useModal } from "@/stores/modal/use-modal-store";
import { currentStoreStore } from "@/stores";
import { ItemFormData, itemSchema } from "@/schemas";
import { formatCurrency, parseCurrency } from "@/utils";
import { useAddItem, useGetCategories, useGetTaxes } from "@/hooks";
import { ErrorMessage } from "@/utils/messages";
import { useAuth } from "@/hooks/auth";

export function AddProductModal() {
  const { open, openModal } = useModal();
  const isOpen = open["add-product"];

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
      {isOpen ? <AddProductFormContent /> : <ProductModalSkeleton />}
      {open["add-category"] && <CategoryModal action="add" />}
    </GlobalModal>
  );
}

function AddProductFormContent() {
  const { user } = useAuth();
  const { closeModal, modalData } = useModal();
  const { currentStore } = currentStoreStore();
  const { mutateAsync: addItemMutate, isPending } = useAddItem();
  const {
    categoryOptions,
    isLoading,
    error,
    refetch,
    pagination,
    page,
    setPage,
  } = useGetCategories();
  const { taxOptions, isLoading: isTaxesLoading } = useGetTaxes();

  const initialBarcode = modalData["add-product"]?.barcode || "";

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      barcode: initialBarcode,
      price: 0,
      cost: 0,
      companyId: String(user?.company?.id),
      type: "PRODUCT",
      taxId: null,
    },
  });

  async function onSubmit(data: ItemFormData) {
    try {
      await addItemMutate({
        ...data,
        cost: data.cost || 0,
        ...(user?.role === "OWNER" && currentStore?.id && { storeId: currentStore?.id }),
      });
      reset();
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(
          error?.response?.data?.message ||
          "Ocorreu um erro ao adicionar o item",
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

  if (isLoading) return <ProductModalSkeleton />;
  if (error) {
    return (
      <RequestError
        refetch={refetch}
        message="Ocorreu um erro ao carregar as categorias"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 sm:grid-flow-col sm:auto-cols-fr"
    >
      <div className="">
        <div className="space-y-4 sm:w-[35rem]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nome"
              startIcon="Tag"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Ex: Teclado Logitech"
            />


            <RHFSelect
              name="taxId"
              label="Imposto (Opcional)"
              options={taxOptions}
              control={control}
            />

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <InputCurrency
                  ref={field.ref}
                  label="Preço Unitário"
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
            <Controller
              control={control}
              name="cost"
              render={({ field }) => (
                <InputCurrency
                  ref={field.ref}
                  label="Custo de Compra"
                  placeholder="0,00"
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  error={errors.cost?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, value } }) => (
                <PaginatedSelect
                  label="Categoria"
                  value={value}
                  options={categoryOptions}
                  onChange={onChange}
                  isLoading={isLoading}
                  pagination={pagination}
                  onPageChange={setPage}
                  placeholder="Selecione uma opção"
                  className="w-full"
                />
              )}
            />

            <RHFSelect
              name="type"
              label="Tipo"
              options={[{ label: "Produto", value: "PRODUCT" }]}
              control={control}
            />

          </div>

          <FeatureGate minPlan="Pro" fallback="hidden">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="quantity"
                startIcon="Scale"
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
            </div>
          </FeatureGate>

          <div className="grid grid-cols-2 gap-4">
            <FeatureGate minPlan="Pro" fallback="hidden">
              <Input
                startIcon="Scale"
                {...register("unit")}
                label="Unidade de Medida (Opcional)"
                error={errors.unit?.message}
              />
            </FeatureGate>
            <Input
              type="number"
              startIcon="Scale"
              label="Quantidade"
              {...register("quantity", { valueAsNumber: true })}
              error={errors.quantity?.message}
            />
          </div>
          <FeatureGate minPlan="Pro" fallback="hidden">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                startIcon="Weight"
                label="Peso (Kg) (opcional)"
                {...register("weight", { valueAsNumber: true })}
                error={errors.weight?.message}
                placeholder="300Kg"
              />
              <Input
                label="Dimensões (opcional)"
                placeholder="Ex: 10x20x30 cm"
                {...register("dimensions")}
                error={errors.dimensions?.message}
              />
            </div>
          </FeatureGate>

          <FeatureGate minPlan="Pro" fallback="hidden">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Data de Validade (opcional)"
                {...register("expiryDate")}
                error={errors.expiryDate?.message}
              />
              <Input
                type="number"
                placeholder="14"
                label="Dias até Expirar (opcional)"
                {...register("daysToExpiry", { valueAsNumber: true })}
                error={errors.daysToExpiry?.message}
              />
            </div>
          </FeatureGate>

          <Textarea
            label="Descrição (opcional)"
            {...register("description")}
            className="mt-1 min-h-[100px]"
            placeholder="Escreva detalhes do item..."
            error={errors.description?.message}
          />
          {/* </ProOnly> */}
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isPending || isSubmitting}>
            Salvar
          </ButtonSubmit>
        </div>
      </div>
    </form>
  );
}
