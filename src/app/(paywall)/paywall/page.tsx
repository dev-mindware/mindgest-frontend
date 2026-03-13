"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/stores";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaywallPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center justify-center p-8 mt-12 mb-auto">
      <div className="max-w-md w-full bg-card rounded-2xl border shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <RefreshCcw className="h-10 w-10 text-destructive" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Subscrição Expirada</h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Olá {user?.name}, o seu plano <strong>{user?.company?.subscription?.plan?.name || "Premium"}</strong> expirou ou está inativo.
            Para continuar a utilizar o sistema, por favor renove a sua subscrição.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            size="lg"
            className="w-full text-base font-semibold bg-primary hover:bg-primary/80 duration-200 text-white border-0 h-14"
            onClick={() => router.push("/billing")}
          >
            Renovar Assinatura
          </Button>
        </div>
      </div>
    </div>
  );
}
