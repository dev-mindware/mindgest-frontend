"use client";

import { Input } from "@/components";
import type { User } from "@/types";

import type { UseFormRegister } from "react-hook-form";
import type { EditProfileFormData } from "@/schemas";
import { cn } from "@/lib";

interface ProfileFormProps {
  user: User | null;
  isEditing?: boolean;
  register: UseFormRegister<EditProfileFormData>;
}

export function ProfileForm({
  user,
  isEditing = false,
  register,
}: ProfileFormProps) {
  if (!user) return null;

  return (
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
      />
      <Input
        {...register("phone")}
        label="Telefone"
        className={`bg-background shadow-none`}
        readOnly={!isEditing}
      />
    </div>
  );
}
