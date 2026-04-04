"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  Textarea,
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
import { useModal, currentStoreStore } from "@/stores";
import { ItemFormData, itemSchema } from "@/schemas";
import {
  useAddItem,
  useCategoriesSelect,
  useTaxesSelect,
  useAuth,
} from "@/hooks";
import { ErrorMessage } from "@/utils/messages";
import { useGetSuppliersSelect } from "@/hooks/entities/use-suppliers";

export function AddProductModal() {
  const { open, openModal, closeModal, modalData } = useModal();
  const isOpen = open["add-product"];

  if (!isOpen) return null;

  return (
    <>
      <GlobalModal
        canClose
        id="add-product"
        title={
          <div className="w-full flex items-center justify-between gap-2 mb-4">
            <span>Adicionar Produto</span>
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
        <AddProductFormContent />
      </GlobalModal>
      {open["add-category"] && <CategoryModal action="add" />}
    </>
  );
}

function AddProductFormContent() {
  const { user } = useAuth();
  const { closeModal, modalData } = useModal();
  const { currentStore } = currentStoreStore();
  const { mutateAsync: addItemMutate, isPending: isAdding } = useAddItem();

  const {
    categoryOptions,
    isLoading: isLoadingCategories,
    isError,
    refetch,
    pagination,
    setPage,
  } = useCategoriesSelect();
  const {
    taxOptions,
    isLoading: isTaxesLoading,
    pagination: taxPagination,
    setPage: setTaxPage,
  } = useTaxesSelect();

  const {
    supplierOptions,
    isLoading: isLoadingSuppliers,
    isError: isErrorSuppliers,
    refetch: refetchSuppliers,
    pagination: paginationSuppliers,
    setPage: setPageSuppliers,
  } = useGetSuppliersSelect();

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
      price: undefined,
      cost: undefined,
      companyId: String(user?.company?.id),
      type: "PRODUCT",
      categoryId: "",
      supplierId: null,
    },
  });

  const cleanPayload = (data: ItemFormData) => {
    return {
      ...data,
      taxId: data.taxId,
      cost: data.cost ?? undefined,
      quantity: data.quantity ?? undefined,
      weight: data.weight ?? undefined,
      minStock: data.minStock ?? undefined,
      maxStock: data.maxStock ?? undefined,
      supplierId: data.supplierId || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  };

  async function onSubmit(data: ItemFormData) {
    try {
      const cleanedData = cleanPayload(data);
      await addItemMutate({
        ...cleanedData,
        ...(user?.role === "OWNER" &&
          currentStore?.id && { storeId: currentStore?.id }),
      });
      handleCancel();
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ErrorMessage(
        (error as any)?.response?.data?.message ||
          "Ocorreu um erro ao adicionar o item",
      );
    }
  }

  const handleCancel = () => {
    reset();
    closeModal("add-product");
  };

  if (isLoadingCategories || isTaxesLoading || isLoadingSuppliers) return <ProductModalSkeleton />;
  if (isError || isErrorSuppliers) {
    return (
      <RequestError
        refetch={() => {
          refetch();
          refetchSuppliers();
        }}
        message="Ocorreu um erro ao carregar os dados"
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
            <Controller
              control={control}
              name="taxId"
              render={({ field: { onChange, value } }) => (
                <PaginatedSelect
                  label="Imposto (Opcional)"
                  value={value}
                  options={taxOptions}
                  onChange={onChange}
                  isLoading={isTaxesLoading}
                  pagination={taxPagination}
                  onPageChange={setTaxPage}
                  placeholder="Selecione um imposto"
                  className="w-full"
                />
              )}
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
                  isLoading={isLoadingCategories}
                  pagination={pagination}
                  onPageChange={setPage}
                  placeholder="Selecione uma opção"
                  className="w-full"
                />
              )}
            />
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <Input
                  type="quantity"
                  startIcon="Scale"
                  label="Quantidade"
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={errors.quantity?.message}
                />
              )}
            />
          </div>

          <FeatureGate minPlan="Smart" fallback="hidden">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="minStock"
                render={({ field }) => (
                  <Input
                    type="quantity"
                    startIcon="Scale"
                    label="Stock Mínimo"
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={errors.minStock?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="maxStock"
                render={({ field }) => (
                  <Input
                    type="quantity"
                    startIcon="Scale"
                    label="Stock Máximo"
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={errors.maxStock?.message}
                  />
                )}
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
              <Input
                type="date"
                label="Data de Validade (opcional)"
                {...register("expiryDate")}
                error={errors.expiryDate?.message}
              />
            </FeatureGate>
          </div>
          <div className="grid grid-cols-1">
            <FeatureGate minPlan="Smart" fallback="hidden">
              <Controller
                control={control}
                name="supplierId"
                render={({ field: { onChange, value } }) => (
                  <PaginatedSelect
                    label="Fornecedor (Opcional)"
                    value={value}
                    options={supplierOptions}
                    onChange={onChange}
                    isLoading={isLoadingSuppliers}
                    pagination={paginationSuppliers}
                    onPageChange={setPageSuppliers}
                    className="w-full"
                    placeholder="Selecione um aopção"
                  />
                )}
              />
            </FeatureGate>
          </div>

          <FeatureGate minPlan="Pro" fallback="hidden">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                inputMode="decimal"
                startIcon="Weight"
                label="Peso (Kg) (opcional)"
                {...register("weight", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || v === undefined)
                      return undefined;
                    const normalized = String(v).replace(",", ".");
                    const parsed = parseFloat(normalized);
                    return isNaN(parsed) ? undefined : parsed;
                  },
                })}
                error={errors.weight?.message}
                placeholder="Ex: 0.24"
              />
              <Input
                label="Dimensões (opcional)"
                placeholder="Ex: 10x20x30 cm"
                {...register("dimensions")}
                error={errors.dimensions?.message}
              />
            </div>
          </FeatureGate>

          <Textarea
            label="Descrição (opcional)"
            {...register("description")}
            className="mt-1 min-h-[100px]"
            placeholder="Escreva detalhes do item..."
            error={errors?.description?.message}
          />
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isAdding || isSubmitting}>
            Salvar
          </ButtonSubmit>
        </div>
      </div>
    </form>
  );
}
