"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Icon
} from "@/components";

export function MobilePosGuard() {
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const isPortrait = window.innerHeight > window.innerWidth;
            const isSmallScreen = window.innerWidth < 768;

            // Block if it's a phone (always) or if it's a tablet in portrait mode
            setIsBlocked(isSmallScreen || isPortrait);
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);
        window.addEventListener("orientationchange", checkDevice);
        return () => {
            window.removeEventListener("resize", checkDevice);
            window.removeEventListener("orientationchange", checkDevice);
        };
    }, []);

    if (!isBlocked) return null;

    return (
        <Dialog open={true} onOpenChange={() => { }}>
            <DialogContent
                className="sm:max-w-[425px] border-none shadow-2xl bg-background/95 backdrop-blur-md"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <div className="flex flex-col items-center justify-center py-8 text-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                        <Icon name="MonitorOff" size={40} />
                    </div>

                    <DialogHeader className="gap-2">
                        <DialogTitle className="text-2xl font-bold">
                            Modo não suportado
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                            O Ponto de Venda requer mais espaço horizontal para funcionar corretamente.
                            <br /><br />
                            Por favor, <strong>rode o seu tablet</strong> para a posição horizontal ou utilize um computador.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="w-full flex flex-col gap-3 mt-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 text-left border border-orange-500/20">
                            <Icon name="RotateCw" className="text-orange-500 h-5 w-5 shrink-0 animate-spin-slow" />
                            <span className="text-sm font-medium text-orange-700">Ação Necessária: Rodar para Horizontal</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-left border border-border/50">
                            <Icon name="Monitor" className="text-primary h-5 w-5 shrink-0" />
                            <span className="text-sm font-medium">Ideal: Computador Desktop/Laptop</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
