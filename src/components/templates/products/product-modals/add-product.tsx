"use client";
import {
  Button,
  GlobalModal,
  Icon,
  Textarea,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TsunamiOnly,
} from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { AddCategory } from "./add-category";
import DatePickerInput from "@/components/custom/date-picker-input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddProductFormData, addProductSchema } from "@/schemas";
import Image from "next/image";
import { useState } from "react";

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

  console.log(handleSubmit, errors)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProductImage(imageUrl);
    }
  };

  const removeImage = () => {
    setProductImage(null);
  };

  return (
<GlobalModal
  id="add-product"
  title="Adicionar Produto"
  className="!h-[85vh]"
  >
  <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            
    {/* Coluna da imagem */}
    <TsunamiOnly>
    <div className="space-y-6">
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
                          document
                            .getElementById("image-upload")
                            ?.click()
                        }
                      >
                        Substituir
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg border-muted-foreground md:w-full bg-sidebar sm:w-25">
                    <div className="text-center">
                      <Icon
                        name="Upload"
                        className="w-8 h-8 mx-auto mb-2 text-gray-400"
                      />
                      <p className="text-sm text-gray-500">
                        Clique para carregar imagem
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() =>
                  document.getElementById("image-upload")?.click()
                }
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal("category")}
        >
          Adicionar Categoria
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome do Produto"
            id="product-name"
            placeholder="Escreva aqui..."
            className="mt-1"
            {...register("name")}
          />
          <Input
            id="product-sku"
            label="SKU ou ID do Produto"
            placeholder="Escreva aqui..."
            className="mt-1"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Categoria</Label>
            <Controller
              control={control}
              name="selectedCategory"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bebidas">Bebidas</SelectItem>
                    <SelectItem value="alimentos">Alimentos</SelectItem>
                    <SelectItem value="limpeza">Limpeza</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <TsunamiOnly>
            <div>
              <Label>Tipo de Medida</Label>
              <Controller
                control={control}
                name="selectedMeasurement"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unidade">Unidade</SelectItem>
                      <SelectItem value="kg">Quilograma</SelectItem>
                      <SelectItem value="litro">Litro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </TsunamiOnly>
        </div>
        <TsunamiOnly>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="supplier"
            label="Fornecedor Padrão"
            placeholder="Escreva aqui..."
            className="mt-1"
            {...register("supplier")}
          />
          <Input
            label="Armazém ou Localização Física"
            id="location"
            placeholder="Escreva aqui..."
            className="mt-1"
            {...register("location")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            id="price"
            startIcon="Coins"
            type="number"
            label="Preço de Venda"
            {...register("price", { valueAsNumber: true })}
          />
          <Input
            id="stock-initial"
            type="quantity"
            label="Stock Inicial"
            {...register("initialStock", { valueAsNumber: true })}
            className="text-center"
          />
          <Input
            id="stock-minimum"
            type="quantity"
            label="Stock Mínimo"
            {...register("minStock", { valueAsNumber: true })}
            className="text-center"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Controller
            control={control}
            name="expiryDate"
            render={({ field }) => (
              <DatePickerInput
                id="expiry-date"
                selected={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div>
            <Label htmlFor="tax">Imposto (IVA)</Label>
            <div className="relative mt-1">
              <Input
                id="tax"
                type="number"
                placeholder="0"
                {...register("tax", { valueAsNumber: true })}
              />
              <span className="absolute text-sm text-gray-500 transform -translate-y-1/2 right-3 top-1/2">
                %
              </span>
            </div>
          </div>
          <Input
            id="warranty"
            type="number"
            label="Garantia"
            {...register("warranty", { valueAsNumber: true })}
            className="text-center"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="restock-time"
            type="number"
            label="Tempo Médio de Reposição"
            {...register("repositionTime", { valueAsNumber: true })}
            className="text-center"
          />
          <Input
            id="daily-sales"
            type="number"
            label="Venda Por Dia"
            {...register("salesPerDay", { valueAsNumber: true })}
            className="text-center"
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
      <Button variant={"outline"}>Cancelar</Button>
      <Button type="submit">Salvar</Button>
    </div>
    </div> 
              
  </div>
  <AddCategory />
</GlobalModal>
  );
}
