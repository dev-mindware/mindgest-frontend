"use client";
import { useAuth } from "@/hooks/auth";
import { PhotoUpload } from "@/components/common/photo-upload";
import { useForm } from "react-hook-form";
import type { File as MyFile } from "@/types";
import { ProfileAvatar } from "./profile/profile-avatar";
import { ProfileForm } from "./profile/profile-form";
import { useFileUpload } from "@/hooks/common/use-upload";
import { useState } from "react";
import { Button } from "@/components";
import { ErrorMessage, getUserRole, SucessMessage } from "@/utils";
import { useUpdateUser } from "@/hooks/users";
import type { UpdateUserProfilePayload } from "@/services";
import { EditProfileFormData } from "@/schemas";

export function Profile() {
  const { user } = useAuth();
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { control, watch, setValue, register, handleSubmit } = useForm<EditProfileFormData>({
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
    }
  });
  const companyLogo = watch("companyLogo");

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateUser();
  const { mutate: uploadLogo, isPending: isUploading } = useFileUpload(
    `/companies/${user?.company?.id}/logo`,
    "companies",
    "PUT",
  );

  const handleUpload = () => {
    if (!companyLogo) return ErrorMessage("Selecione um arquivo antes de atualizar.");

    uploadLogo(
      { files: { file: companyLogo as MyFile } },
      {
        onSuccess: () => {
          SucessMessage("Logo da empresa atualizada com sucesso!");
          setValue("companyLogo", undefined);
          setIsEditingLogo(false);
        },
        onError: (error: any) =>
          ErrorMessage(error?.response?.data?.message || "Erro ao atualizar logo da empresa"),
      }
    );
  };

  const handleProfileSubmit = (data: EditProfileFormData) => {

    const updateData: UpdateUserProfilePayload = {};
    if (data.name && data.name !== user?.name) updateData.name = data.name;
    if (data.phone && data.phone !== user?.phone) updateData.phone = data.phone;

    if (Object.keys(updateData).length === 0) {
      SucessMessage("Perfil atualizado com sucesso!");
      setIsEditingProfile(false);
      return;
    }

    updateProfile(updateData, {
      onSuccess: () => {
        SucessMessage("Perfil atualizado com sucesso!");
        setIsEditingProfile(false);
      },
      onError: (error: any) => {
        ErrorMessage(error?.response?.data?.message || "Erro ao atualizar perfil");
      }
    });
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais e da empresa.
          </p>
        </div>
      </div>  

      <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <ProfileAvatar
          userName={user?.name}
        />
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-xl font-bold">{user?.name}</h3>
          <p className="text-muted-foreground">{getUserRole(user?.role!)}</p>
          {user?.company?.name && <p className="text-sm text-foreground/80 mt-1">{user.company.name}</p>}
        </div>
        <div className="sm:ml-auto flex gap-2">
          <Button
            variant={isEditingProfile ? "default" : "outline"}
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            {isEditingProfile ? "Atualizar Perfil" : "Editar Perfil"}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h3 className="font-semibold text-lg">Informação Pessoal / Empresa</h3>
        </div>
        <ProfileForm user={user} isEditing={isEditingProfile} register={register} />

        {isEditingProfile && (
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="ghost" onClick={() => setIsEditingProfile(false)} disabled={isUpdatingProfile}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit(handleProfileSubmit)} disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "A gravar..." : "Guardar Alterações"}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Logo da Empresa</h3>
          {user?.company?.logo && !isEditingLogo && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingLogo(true)}>
              Trocar Logo
            </Button>
          )}
          {user?.company?.logo && isEditingLogo && (
            <Button variant="ghost" size="sm" onClick={() => { setIsEditingLogo(false); setValue('companyLogo', undefined); }}>
              Cancelar
            </Button>
          )}
        </div>

        {(!user?.company?.logo || isEditingLogo) ? (
          <div className="flex flex-col gap-3 w-full sm:max-w-xs">
            <PhotoUpload
              name="companyLogo"
              control={control}
              info="Máximo 2MB"
              label={user?.company?.logo ? "Carregar Nova Logo" : "Carregar Logo"}
              accept="image"
              maxSize={1024 * 1024 * 2}
              className="w-full"
              disabled={isUploading}
            />

            {companyLogo && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? "A enviar..." : "Atualizar Imagem"}
              </Button>
            )}
          </div>
        ) : (
          <div className="relative w-40 h-40 bg-muted/30 rounded-xl flex items-center justify-center border border-border overflow-hidden shrink-0 shadow-sm">
            <img
              src={user.company.logo}
              alt="Logo da empresa"
              className="max-h-full max-w-full object-contain p-2"
            />
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-6">
          Exibido em documentos, faturas e recibos. (Recomendado: .jpg ou .png)
        </p>
      </div>

    </div>
  );
}
