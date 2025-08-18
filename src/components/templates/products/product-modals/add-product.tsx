"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { measurement, category, } from "./constant-data";


import {
  Button,
  GlobalModal,
  Icon,
  Textarea,
  Label,
  Input,
  TsunamiOnly,
  RHFSelect,
} from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { AddCategory } from "./add-category";
import { AddProductFormData, addProductSchema } from "@/schemas";

export function AddProduct() {
  const { openModal } = useModal();
  const [productImage, setProductImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      initialStock: 1,
      minStock: 0,
      warranty: 0,
      repositionTime: 0,
      salesPerDay: 0,
      tax: 0,
    },
  });

  const removeImage = () => setProductImage(null);

  const onSubmit = (data: AddProductFormData) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <GlobalModal id="add-product" title="Adicionar Produto" className="!h-[85vh]">
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Coluna da imagem */}
        <TsunamiOnly>
          <div className="space-y-6">
            {/* Upload da Imagem */}
            <div className="rounded-lg bg-sidebar">
              <div className="lg:p-6">
                <h3 className="mb-4 font-semibold">Imagem do Produto</h3>
                <div className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="image-tag">Tag</Label>
                    <Input
                      id="image-tag"
                      placeholder="Escreva algo que representa a imagem..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Imagem</Label>
                    <div className="relative mt-2">
                      {productImage ? (
                        <div>
                          <Image
                            src={productImage}
                            alt="Product"
                            width={400}
                            height={200}
                            className="object-cover w-full h-48 rounded-lg"
                          />
                          <div className="absolute flex gap-2 bottom-2 left-2 right-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                document.getElementById("image-upload")?.click()
                              }
                            >
                              Substituir
                            </Button>
                            <Button variant="destructive" size="sm" onClick={removeImage}>
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg border-muted-foreground bg-sidebar">
                          <div className="text-center">
                            <Icon name="Upload" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">Clique para carregar imagem</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <Icon name="Upload" className="w-4 h-4 mr-2" />
                      Adicionar Imagem
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Código de barras */}
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

        {/* Coluna das informações gerais */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Informação Geral</h3>
            <Button variant="outline" size="sm" onClick={() => openModal("category")}>
              Adicionar Categoria
            </Button>
          </div>

          <div className="space-y-4">
            {/* Nome e SKU */}
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

            {/* Categoria e Medida */}
            <div className="grid gap-4 sm:grid-cols-2">
                <RHFSelect
                    name="selectedCategory"
                    options={category}
                    control={control}
                    label="Categoria"
                  />
                  <Input
                  id="price"
                  type="number"
                  startIcon="Coins"
                  label="Preço de Venda"
                  error={errors.price?.message}
                  {...register("price", { valueAsNumber: true })}
                />
            </div>

            {/* Fornecedor, Localização, Preço, Estoque */}
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
                <RHFSelect
                    name="selectedMeasurement"
                    options={measurement}
                    control={control}
                    label="Tipo de Medida"
                  />
                <Input
                  type="quantity"
                  id="stock-initial"
                  label="Stock Inicial"
                  className="text-center"
                  error={errors.initialStock?.message}
                  {...register("initialStock", { valueAsNumber: true })}
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
                  {...register("expiryDate")}
                  error={errors.expiryDate?.message}
                />
                <div>
                  <div className="relative mt-1">
                    <Input
                      id="tax"
                      type="number"
                      label="Imposto"
                      placeholder="0.00"
                      startIcon="Percent"
                      error={errors.tax?.message}
                      {...register("tax", { valueAsNumber: true })}
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

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="quantity"
                  id="restock-time"
                  className="text-center"
                  label="Tempo Médio de Reposição"
                  error={errors.repositionTime?.message}
                  {...register("repositionTime", { valueAsNumber: true })}
                />
                <Input
                  type="quantity"
                  id="daily-sales"
                  label="Venda Por Dia"
                  className="text-center"
                  error={errors.salesPerDay?.message}
                  {...register("salesPerDay", { valueAsNumber: true })}
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

          <div className="flex items-center justify-end gap-4 mt-4">
            <Button variant="outline">Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </div>
      </form>
      <AddCategory />
    </GlobalModal>
  );
}
