"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGetCurrentSession } from "@/hooks/entities/use-cash-sessions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Button,
    Icon,
} from "@/components";
import { currentStoreStore } from "@/stores";

export function PosSessionGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { currentStore } = currentStoreStore();
    const { data: currentSession, isLoading } = useGetCurrentSession(currentStore?.id);

    // Paths that require an active session
    const protectedPaths = ["/pos/counter", "/pos/movements"];
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

    // If loading and on a protected path, we could show a loader or just wait
    if (isLoading && isProtectedPath) return null;

    // If not a protected path, allow access
    if (!isProtectedPath) return <>{children}</>;

    // If there is an active session, allow access
    if (currentSession && currentSession.isOpen) {
        return <>{children}</>;
    }

    // Otherwise, show blocking modal
    return (
        <>
            <Dialog open={true}>
                <DialogContent
                    className="sm:max-w-[425px] flex flex-col items-center justify-center p-8"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Icon name="Lock" className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-xl font-bold">
                                Sessão de Caixa Fechada
                            </DialogTitle>
                            <DialogDescription>
                                Você não possui uma sessão de caixa aberta para realizar operações.
                                Por favor, abra uma nova sessão para continuar.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 pt-6 w-full">
                        <Button
                            className="w-full h-12 text-base font-semibold"
                            onClick={() => router.push("/pos/settings")}
                        >
                            <Icon name="Settings" className="mr-2 h-5 w-5" />
                            Ir para Configurações
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Map through children but they are effectively blocked by the modal overlay */}
            <div className="blur-sm pointer-events-none grayscale opacity-50">
                {children}
            </div>
        </>
    );
}
