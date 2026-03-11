"use client";
import { useAuth } from "@/hooks/auth";
import { ProfileForm } from "./profile/profile-form";
import { CompanyForm } from "./profile/company-form";
import { CompanyLogoForm } from "./profile/company-logo-form";

export function Profile() {
  const { user } = useAuth();

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

      <ProfileForm user={user} />

      <CompanyForm user={user!} />

      <CompanyLogoForm user={user} />
    </div>
  );
}

