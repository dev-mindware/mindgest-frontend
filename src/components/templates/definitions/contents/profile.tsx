"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Card } from "@/components/ui";

interface ProfileFormData {
  companyLogo?: MyFile;
}

export function Profile() {
  const { user } = useAuth();
  const { control, watch } = useForm<ProfileFormData>();

  const { mutate: uploadLogo, isPending: isUploading } = useFileUpload(
    `/companies/${user?.company?.id}/logo`,
    "companies",
    "PUT",
  );

  const companyLogo = watch("companyLogo");

  const handleUploadLogo = () => {
    if (companyLogo && companyLogo.url) {
      uploadLogo(
        {
          files: { file: companyLogo },
        },
        {
          onSuccess: () =>
            toast.success("Logo da empresa atualizada com sucesso!"),
          onError: (error: any) =>
            toast.error(
              error?.response?.data?.message ||
                "Erro ao atualizar logo da empresa",
            ),
        },
      );
    }
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
    <div className="space-y-6" suppressHydrationWarning>
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between border-b pb-6">
        <div>
          <h2 className="text-3xl font-[800] tracking-tight">Meu Perfil</h2>
          <p className="text-muted-foreground mt-1 text-sm/relaxed">
            Gerencie suas informações pessoais e da empresa.
          </p>
        </div>
        {user?.role && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold tracking-wider uppercase border border-primary/50">
            {getRoleLabel(user.role)}
          </span>
        )}
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-6 flex w-full max-w-sm grid-cols-3 bg-muted/50 p-1 rounded-xl">
          {["Geral", "Empresa", "Segurança"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.includes("ç") ? tab.toLowerCase().replace("ç", "c") : tab.toLowerCase()}
              className="flex-1 rounded-lg"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value="geral"
          className="mt-4 outline-none animate-in fade-in-50 duration-500"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-5">
            <div className="w-full lg:w-72 shrink-0 space-y-6">
              <Card className="p-6 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
                <h3 className="font-semibold mb-6 w-full text-left text-xs uppercase tracking-wider text-muted-foreground">
                  Foto de Perfil
                </h3>
                <div className="scale-90 origin-top w-full flex justify-center">
                  <ProfileAvatar
                    currentImage={user?.company?.logo || undefined}
                    userName={user?.name}
                  />
                </div>
              </Card>
            </div>
            <div className="flex-1 max-w-3xl">
              <ProfileForm user={user} />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="empresa"
          className="my-4 outline-none animate-in fade-in-50 duration-500"
        >
          <div className="">
            <Card className="p-6 border-border">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Logo da Empresa</h3>
                <p className="text-sm text-muted-foreground">
                  A imagem exibida em seus documentos e faturas. Recomendamos
                  uma altura máxima de 512px.
                </p>
              </div>
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full sm:w-72 shrink-0">
                  {!user?.company?.logo ? (
                    <PhotoUpload
                      label="Carregar Logo"
                      name="companyLogo"
                      control={control}
                      accept="image"
                      maxSize={1024 * 1024 * 2}
                      className="w-full"
                      disabled={isUploading}
                      showConfirmButton={true}
                      onConfirm={handleUploadLogo}
                    />
                  ) : (
                    <div className="relative group w-full aspect-video bg-muted/30 rounded-xl flex items-center justify-center border-2 border-dashed border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/50">
                      <img
                        src={user.company.logo}
                        alt="Logo da empresa"
                        className="max-h-full max-w-full object-contain p-4 transition-transform duration-300 group-hover:scale-95"
                      />
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <PhotoUpload
                          label="Alterar Logo"
                          name="companyLogo"
                          control={control}
                          accept="image"
                          maxSize={1024 * 1024 * 2}
                          className="w-auto scale-90"
                          disabled={isUploading}
                          showConfirmButton={true}
                          onConfirm={handleUploadLogo}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="seguranca"
          className="mt-4 outline-none animate-in fade-in-50 duration-500"
        >
          <div className="w-ful space-y-6">
            <Card className="p-6">
              <AccountSecurity user={user} />
            </Card>
            <Card className="p-6">
              <SupportAccess />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
