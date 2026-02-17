"use client";

import { Separator } from "@/components";
import { useAuth } from "@/hooks/auth";
import { PhotoUpload } from "@/components/common/photo-upload";
import { useForm, Controller } from "react-hook-form";
import type { File as MyFile } from "@/types";
import { ProfileAvatar } from "./profile/profile-avatar";
import { ProfileForm } from "./profile/profile-form";
import { AccountSecurity } from "./profile/account-security";
import { SupportAccess } from "./profile/support-access";
import { useFileUpload } from "@/hooks/common/use-upload";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileFormData {
  companyLogo?: MyFile;
}

export function Profile() {
  const { user } = useAuth();
  const { control, watch, setValue } = useForm<ProfileFormData>();
  const [selectedFile, setSelectedFile] = useState<MyFile | null>(null);

  const { mutate: uploadLogo, isPending: isUploading } = useFileUpload(
    `/companies/${user?.company?.id}/logo`,
    "companies",
    "PUT"
  );

  const companyLogo = watch("companyLogo");

  const handleUpload = () => {
    if (!selectedFile) return toast.error("Selecione um arquivo antes de atualizar.");

    uploadLogo(
      { files: { file: selectedFile } },
      {
        onSuccess: () => {
          toast.success("Logo da empresa atualizada com sucesso!");
          setSelectedFile(null);
          setValue("companyLogo", undefined);
        },
        onError: (error: any) =>
          toast.error(error?.response?.data?.message || "Erro ao atualizar logo da empresa"),
      }
    );
  };

  const getRoleLabel = (role?: string) => {
    const roleMap: Record<string, string> = {
      OWNER: "Proprietário",
      MANAGER: "Gerente",
      ADMIN: "Administrador",
      CASHIER: "Caixa",
    };
    return roleMap[role || ""] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl text-center md:text-start">Meu Perfil</h2>
          <p className="text-center text-muted-foreground md:text-start">
            Personalize o seu perfil MindGest quando quiser.
          </p>
        </div>
        {user?.role && <span className="font-medium text-primary">{getRoleLabel(user.role)}</span>}
      </div>

      <div className="flex flex-col justify-between items-center w-full gap-4 md:flex-row">
        <ProfileAvatar currentImage={user?.company?.logo || undefined} userName={user?.name} />

        {!user?.company?.logo ? (
          <div className="flex flex-col items-center gap-2">
            <Controller
              name="companyLogo"
              control={control}
              render={({ field }) => (
                <PhotoUpload
                  label="Logo da Empresa"
                  {...field}
                  accept="image"
                  maxSize={1024 * 1024 * 2}
                  className="max-w-xs"
                  onChange={(file) => {
                    field.onChange(file);
                    setSelectedFile(file || null);
                  }}
                  disabled={isUploading}
                />
              )}
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="mt-2 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? "Enviando..." : "Atualizar Imagem"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src={user.company.logo}
              alt="Logo da empresa"
              className="max-w-xs rounded-md border border-muted"
            />
            <Controller
              name="companyLogo"
              control={control}
              render={({ field }) => (
                <PhotoUpload
                  label="Trocar Logo"
                  {...field}
                  accept="image"
                  maxSize={1024 * 1024 * 2}
                  className="max-w-xs"
                  onChange={(file) => {
                    field.onChange(file);
                    setSelectedFile(file || null);
                  }}
                  disabled={isUploading}
                />
              )}
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="mt-2 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? "Enviando..." : "Atualizar Imagem"}
            </button>
          </div>
        )}
      </div>

      <ProfileForm user={user} />
      <AccountSecurity user={user} />
      <SupportAccess />
    </div>
  );
}


/* "use client";

import { Separator } from "@/components";
import { useAuth } from "@/hooks/auth";
import { PhotoUpload } from "@/components/common/photo-upload";
import { useForm } from "react-hook-form";
import type { File as MyFile } from "@/types";
import { ProfileAvatar } from "./profile/profile-avatar";
import { ProfileForm } from "./profile/profile-form";
import { AccountSecurity } from "./profile/account-security";
import { SupportAccess } from "./profile/support-access";
import { useFileUpload } from "@/hooks/common/use-upload";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProfileFormData {
  companyLogo?: MyFile;
}

export function Profile() {
  const { user } = useAuth();
  const { control, watch } = useForm<ProfileFormData>();

  const { mutate: uploadLogo, isPending: isUploading } = useFileUpload(
    `/companies/${user?.company?.id}/logo`,
    "companies", "PUT"
  );

  const companyLogo = watch("companyLogo");

  useEffect(() => {
    if (companyLogo && companyLogo.url) {
      uploadLogo(
        {
          files: { file: companyLogo },
        },
        {
          onSuccess: () => toast.success("Logo da empresa atualizada com sucesso!"),
          onError: (error: any) =>
            toast.error(error?.response?.data?.message || "Erro ao atualizar logo da empresa"),
        }
      );
    }
  }, [companyLogo, uploadLogo]);

  const getRoleLabel = (role?: string) => {
    const roleMap: Record<string, string> = {
      OWNER: "Proprietário",
      MANAGER: "Gerente",
      ADMIN: "Administrador",
      CASHIER: "Caixa",
    };
    return roleMap[role || ""] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl text-center md:text-start">Meu Perfil</h2>
          <p className="text-center text-muted-foreground md:text-start">
            Personalize o seu perfil MindGest quando quiser.
          </p>
        </div>
        {user?.role && <span className="font-medium text-primary">{getRoleLabel(user.role)}</span>}
      </div>

      <div className="flex flex-col justify-between items-center w-full gap-8 md:flex-row">
        <ProfileAvatar currentImage={user?.company?.logo || undefined} userName={user?.name} />

        {!user?.company?.logo ? (
          <PhotoUpload
            label="Logo da Empresa"
            name="companyLogo"
            control={control}
            accept="image"
            maxSize={1024 * 1024 * 2}
            className="max-w-xs"
            disabled={isUploading}
          />
        ) : (
          <img
            src={user.company.logo}
            alt="Logo da empresa"
            className="max-w-xs rounded-md border border-muted"
          />
        )}
      </div>

      <ProfileForm user={user} />
      <AccountSecurity user={user} />
      <SupportAccess />
    </div>
  );
}
 */