"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/components";
import type { User } from "@/types";
import { ProfileAvatar } from "./profile-avatar";
import { useUpdateUser } from "@/hooks/users";
import { ErrorMessage, getUserRole, SucessMessage } from "@/utils";
import type { UpdateUserProfilePayload } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema, EditProfileFormData } from "@/schemas/edit-profile-schema";
import { cn } from "@/lib";

export function ProfileForm({ user }: { user: User | null }) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
    },
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateUser();

  const handleProfileSubmit = (data: EditProfileFormData) => {
    const updateData: UpdateUserProfilePayload = {};
    if (data.name && data.name !== user?.name) updateData.name = data.name;
    if (data.phone && data.phone !== user?.phone) updateData.phone = data.phone;

    if (Object.keys(updateData).length === 0) {
      SucessMessage("Perfil atualizado com sucesso!");
      setIsEditing(false);
      return;
    }

    updateProfile(updateData, {
      onSuccess: () => {
        SucessMessage("Perfil atualizado com sucesso!");
        setIsEditing(false);
      },
      onError: (error: any) => {
        ErrorMessage(
          error?.response?.data?.message || "Erro ao atualizar perfil",
        );
      },
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <ProfileAvatar userName={user?.name} />
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-xl font-bold">{user?.name}</h3>
          <p className="text-muted-foreground">{getUserRole(user?.role!)}</p>
          {user?.company?.name && (
            <p className="text-sm text-foreground/80 mt-1">
              {user.company.name}
            </p>
          )}
        </div>
        <div className="sm:ml-auto flex gap-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Atualizar Perfil" : "Editar Perfil"}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h3 className="font-semibold text-lg">Informação Pessoal</h3>
        </div>
        
        <div
          className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", {
            "pointer-events-none": !isEditing,
          })}
        >
          <Input
            {...register("name")}
            label="Nome"
            className={`bg-background shadow-none`}
            readOnly={!isEditing}
            error={errors.name?.message}
          />
          <Input
            {...register("phone")}
            label="Telefone"
            className={`bg-background shadow-none`}
            readOnly={!isEditing}
            error={errors.phone?.message}
          />
        </div>

        {isEditing && (
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              disabled={isUpdatingProfile}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(handleProfileSubmit)}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? "A gravar..." : "Guardar Alterações"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
