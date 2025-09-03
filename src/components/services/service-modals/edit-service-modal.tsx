"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { status, category } from "./constant-data";

import {
  Button,
  GlobalModal,
  Textarea,
  Label,
  Input,
  RHFSelect,
} from "@/components";
import { useModal } from "@/stores/use-modal-store";
import { AddServiceFormData, addServiceSchema } from "@/schemas";
import { currentServiceStore } from "@/stores";
import { useEffect } from "react";
import { AddCategoryModal } from "@/components/categories";
import { formatCurrency, parseCurrency } from "@/utils";

export function EditServiceModal() {
  const { openModal, closeModal } = useModal();
  const { currentService } = currentServiceStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddServiceFormData>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      price: 0,
      selectedStatus: "Activo",
      description: "",
    },
  });

  useEffect(() => {
    if (currentService) {
      reset({
        name: currentService.name ?? "",
        selectedCategory: currentService.category ?? "",
        price: currentService.price ?? 0,
        selectedStatus: currentService.status ?? "Activo",
        description: currentService.description ?? "",
      });
    }
  }, [currentService, reset]);
  
  const onSubmit = (data: AddServiceFormData) => {
    alert(JSON.stringify(data, null, 2));
  };
  
  const handleCancel = () => {
    reset();
    closeModal("edit-service");
  };

  return (
    <GlobalModal
      id="edit-service"
      title="Editar Serviço"
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
          variant="outline"
          size="sm"
          onClick={() => openModal("add-category")}
        >
          Adicionar Categoria
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="">
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
              <RHFSelect
                control={control}
                label="Categoria"
                options={category}
                name="selectedCategory"
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
                label="Status"
                options={status}
                control={control}
                name="selectedStatus"
              />
            </div>

            <Label>Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Escreva aqui..."
            />
          </div>
        </div>
      </form>
      <AddCategoryModal />
    </GlobalModal>
  );
}