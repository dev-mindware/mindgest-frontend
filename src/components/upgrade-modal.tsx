"use client";
import Link from "next/link";
import { GlobalModal } from "./modal";
import { Button } from "./ui";
import { useModal } from "@/stores";
import { Sparkles } from "lucide-react";

export function UpgradeModal({ feature }: { feature: string }) {
  const { closeModal } = useModal();

  return (
    <GlobalModal
      id="upgrade-modal"
      className="w-[28rem]"
      title={
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Recurso Premium
        </div>
      }
    >
      <div className="py-5 space-y-4">
        {/* Texto principal */}
        <div className="text-center space-y-3">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            O recurso{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {feature}
            </span>{" "}
            está disponível apenas em planos superiores. Atualize agora e
            desbloqueie todas as funcionalidades!
          </p>
        </div>

        {/* Preço */}
        <div className="text-center py-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Planos a partir de
          </p>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            5.445,22{" "}
            <span className="text-base font-normal text-slate-600 dark:text-slate-400">
              kz
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => closeModal("upgrade-modal")}
            className="flex-1"
          >
            Talvez Depois
          </Button>
          <Link href="/pricing" className="block flex-1">
            <Button className="w-full bg-primary text-white hover:opacity-90">
              Ver Planos
            </Button>
          </Link>
        </div>
      </div>
    </GlobalModal>
  );
}