"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components";
import type { User, File as MyFile } from "@/types";
import { PhotoUpload } from "@/components/common/photo-upload";
import { useFileUpload } from "@/hooks/common/use-upload";
import { ErrorMessage, SucessMessage } from "@/utils";
import { useRouter } from "next/navigation";

export function CompanyLogoForm({ user }: { user: User | null }) {
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const router = useRouter()

  const { control, watch, setValue } = useForm<{ companyLogo?: MyFile | null }>();
  const companyLogo = watch("companyLogo");

  const { mutateAsync: uploadLogo, isPending: isUploading } = useFileUpload(
    `/companies/logo`,
    "companies",
    "PUT",
  );

  const handleUpload = async () => {
    if (!companyLogo) return ErrorMessage("Selecione um arquivo antes de atualizar.");

    await uploadLogo(
      { files: { file: companyLogo as MyFile } },
      {
        onSuccess: () => {
          SucessMessage("Logo da empresa atualizada com sucesso!");
          setValue("companyLogo", null);
          setIsEditingLogo(false);
          router.refresh();
        },
        onError: (error: any) =>
          ErrorMessage(
            error?.response?.data?.message || "Erro ao atualizar logo da empresa",
          ),
      },
    );
  };

  if (!user) return null;

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Logo da Empresa</h3>
        {user?.company?.logo && !isEditingLogo && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingLogo(true)}
          >
            Trocar Logo
          </Button>
        )}
        {user?.company?.logo && isEditingLogo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditingLogo(false);
              setValue("companyLogo", null);
            }}
          >
            Cancelar
          </Button>
        )}
      </div>

      {!user?.company?.logo || isEditingLogo ? (
        <div className="flex flex-col gap-3 w-full sm:max-w-xs">
          <PhotoUpload
            name="companyLogo"
            control={control}
            info="Máximo 2MB"
            label={
              user?.company?.logo ? "Carregar Nova Logo" : "Carregar Logo"
            }
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
        <div className="relative h-48 w-full sm:w-80 bg-muted/10 rounded-xl flex items-center justify-center border overflow-hidden shrink-0 shadow-sm p-4">
          <img
            src={user.company.logo}
            alt="Logo da empresa"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-6">
        Exibido em documentos, faturas e recibos. (Recomendado: .jpg ou .png)
      </p>
    </div>
  );
}
