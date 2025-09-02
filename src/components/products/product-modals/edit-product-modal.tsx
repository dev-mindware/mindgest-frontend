"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { measurement, category, status } from "./constant-data";
import { currentProductStore } from "@/stores";
import {
  Button,
  GlobalModal,
  Textarea,
  Label,
  Input,
  TsunamiOnly,
  RHFSelect,
} from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { AddProductFormData, addProductSchema } from "@/schemas";
import { useEffect } from "react";
import { AddCategoryModal } from "@/components/categories";
import { formatCurrency, parseCurrency } from "@/utils";

export function EditProductModal() {
  const { openModal, closeModal } = useModal();
  const { currentProduct } = currentProductStore();
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
      selectedStatus: "Disponível",
      price: 0,
    },
  });

  useEffect(() => {
    if (currentProduct) {
      reset({
        ...currentProduct,
        price: currentProduct.price ?? 0,
        expiryDate: currentProduct.expirydate
          ? new Date(currentProduct.expirydate)
          : null,
        selectedCategory: currentProduct.category ?? "",
        selectedMeasurement: currentProduct.measurement ?? "",
        selectedStatus: currentProduct.status ?? "Disponível",
      });
    }
  }, [currentProduct, reset]);

  const onSubmit: SubmitHandler<AddProductFormData> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  const handleCancel = () => {
    reset();
    closeModal("edit-product");
  };

  return (
    <GlobalModal
      id="edit-product"
      title="Editar Produto"
      className="!max-h-[85vh] !w-max"
      canClose
      footer={
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>Salvar</Button>
        </div>
      }
    >
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => openModal("add-category")}
        >
          Adicionar Categoria
        </Button>
      </div>
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
        </TsunamiOnly>

        <div className="">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Informação Geral</h3>
          </div>
          <div className="space-y-4 sm:w-[35rem]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                className="mt-1"
                id="product-name"
                {...register("name")}
                startIcon="User"
                label="Nome do Produto"
                placeholder="Escreva aqui..."
                error={errors.name?.message}
              />
              <Input
                id="product-sku"
                className="mt-1"
                startIcon="IdCard"
                {...register("sku")}
                error={errors.sku?.message}
                label="SKU ou ID do Produto"
                placeholder="Escreva aqui..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <RHFSelect
                name="selectedCategory"
                options={category}
                control={control}
                label="Categoria"
              />
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
            </div>

            <TsunamiOnly className="space-y-4">
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
            </TsunamiOnly>
          </div>
        </div>
      </form>
      <AddCategoryModal />
    </GlobalModal>
  );
}