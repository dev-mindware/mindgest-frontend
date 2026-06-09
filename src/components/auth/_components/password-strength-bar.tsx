"use client";
import { cn } from "@/lib/utils";

export type StrengthLevel = 0 | 1 | 2 | 3;

export interface StrengthConfig {
  level: StrengthLevel;
  label: string;
  color: string;
  textColor: string;
}

export function getStrength(pass: string): StrengthConfig {
  if (!pass) return { level: 0, label: "", color: "", textColor: "" };

  let score = 0;
  if (pass.length >= 8) score++;
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
  if (/\d/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 1) return { level: 1, label: "Fraca",  color: "bg-red-500",    textColor: "text-red-500" };
  if (score <= 2) return { level: 2, label: "Média",  color: "bg-yellow-400", textColor: "text-yellow-500" };
  return             { level: 3, label: "Forte",  color: "bg-green-500",  textColor: "text-green-600" };
}

export function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;

  const { level, label, color, textColor } = getStrength(password);

  return (
    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex gap-1.5">
        {([1, 2, 3] as const).map((seg) => (
          <div
            key={seg}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              level >= seg ? color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium", textColor)}>{label}</p>
    </div>
  );
}
