"use client";
import { Input } from "@/components";
import type { User } from "@/types";

interface ProfileFormProps {
  user: User | null;
}

export function ProfileForm({ user }: ProfileFormProps) {
  if (!user) return null;

  const [firstName, ...lastNameParts] = (user.name || "").split(" ");
  const lastName = lastNameParts.join(" ");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Input label="Nome" defaultValue={firstName} />
      <Input label="Sobrenome" defaultValue={lastName} />
      <Input label="Nome da Empresa" defaultValue={user.company?.name || ""} />
      <Input
        label="NIF"
        defaultValue={user.company?.taxNumber || ""}
        placeholder="Ex: 598364343"
      />
    </div>
  );
}
