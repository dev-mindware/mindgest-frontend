"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/utils/messages";
import { useModal } from "@/stores";
import {
  Button,
  Input,
  GlobalModal,
  ButtonSubmit,
  RHFSelect,
  RequestError,
} from "@/components";
import { useGetStores } from "@/hooks/entities";
import {
  CollaboratorFormData,
  collaboratorSchema,
} from "@/schemas/add-collaborator";
import { currentCollaboratorStore } from "@/stores/collaborators/current-collaborator-store";
import {
  useAddCollaborator,
  useUpdateCollaborator,
} from "@/hooks/collaborators/use-collaborator";
const roleOptions = [
  { label: "Gerente", value: "MANAGER" },
  { label: "Caixa", value: "CASHIER" },
];

type CollaboratorModalProps = {
  action: "add" | "edit";
};

export function CollaboratorModal({ action }: CollaboratorModalProps) {
  const { closeModal, open } = useModal();
  const isOpen = open["add-collaborator"] || open["edit-collaborator"];
  const { currentCollaborator } = currentCollaboratorStore();
  const { mutateAsync: addCollaborator, isPending: isAdding } =
    useAddCollaborator();
  const { mutateAsync: editCollaborator, isPending: isEditing } =
    useUpdateCollaborator();

  const { stores, isLoading: isLoadingStores, error, refetch } = useGetStores();

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollaboratorFormData>({
    resolver: zodResolver(collaboratorSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (action === "edit" && currentCollaborator) {
      reset({
        name: currentCollaborator.name,
        phone: currentCollaborator.phone,
        role: currentCollaborator.role as "MANAGER" | "CASHIER",
        storeId: currentCollaborator.storeId,
      });
    }
  }, [action, currentCollaborator, reset]);

  async function onSubmit(data: CollaboratorFormData) {
    try {
      const { password, ...finalData } = data;

      if (action === "add") {
        await addCollaborator({
          ...finalData,
          password,
          storeId: data.storeId,
        });
      } else if (action === "edit" && currentCollaborator) {
        await editCollaborator({
          id: currentCollaborator.id,
          data: {
            name: finalData.name,
            phone: finalData.phone,
            role: finalData.role,
            storeId: data.storeId,
          },
        });
      }

      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Ocorreu um erro ao salvar o cliente."
      );
    }
  }

  const handleCancel = () => {
    reset();
    closeModal(action === "add" ? "add-collaborator" : "edit-collaborator");
  };

  if ((action === "edit" && !currentCollaborator) || !isOpen) return null;
  if (isLoadingStores) return <p>Carregando lojas...</p>;
  if (error)
    return (
      <RequestError
        refetch={refetch}
        message="Ocorreu um erro ao carregar as lojas"
      />
    );

  return (
    <GlobalModal
      canClose
      id={action === "add" ? "add-collaborator" : "edit-collaborator"}
      title={action === "add" ? "Adicionar Colaborador" : "Editar Colaborador"}
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            startIcon="User"
            placeholder="Ex: Ceara Coveney"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Telefone"
            startIcon="Phone"
            maxLength={9}
            placeholder="9xxxxxxxx"
            {...register("phone")}
            error={errors.phone?.message}
          />

          {action === "add" && (
            <>
              <Input
                type="email"
                label="Email"
                startIcon="Mail"
                placeholder="Ex: cea.co@gmail.com"
                {...register("email")}
                error={errors.email?.message}
              />

              <Input
                label="Senha"
                startIcon="Lock"
                placeholder="Ex: 12345678"
                {...register("password")}
                error={errors.password?.message}
              />
            </>
          )}

          <RHFSelect
            name="role"
            control={control}
            label="Função"
            options={roleOptions}
          />
          <RHFSelect
            control={control}
            label="Loja"
            options={stores}
            name="storeId"
          />
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit
            className="w-max"
            isLoading={isSubmitting || isAdding || isEditing}
          >
            {action === "add" ? "Adicionar" : "Salvar Alterações"}
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
