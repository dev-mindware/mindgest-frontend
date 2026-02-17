"use client";

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
    `/api/companies/${user?.company?.id}/logo`,
    "companies"
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
