"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useBulkDeleteItems } from "@/hooks";

interface BulkDeleteProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSuccess: () => void;
}

export function BulkDeleteProductsModal({
  isOpen,
  onClose,
  selectedIds,
  onSuccess,
}: BulkDeleteProductsModalProps) {
  const { mutateAsync: bulkDelete, isPending } = useBulkDeleteItems();

  const handleConfirm = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDelete(selectedIds);
      onSuccess();
      onClose();
    } catch {
      // O hook useBulkDeleteItems já exibe o ErrorMessage
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="sm:max-w-[460px] p-6 rounded-2xl bg-card border border-border shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Eliminar {selectedIds.length} produto(s)?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Esta ação requer confirmação expressa.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3 text-sm text-muted-foreground space-y-3">
          <p>
            Tem a certeza que deseja eliminar os{" "}
            <span className="font-semibold text-foreground">
              {selectedIds.length} produto(s)
            </span>{" "}
            selecionado(s)?
          </p>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Atenção:</strong> Por conformidade fiscal (AGT/SAFT),
              produtos que já tenham faturas emitidas ou transações financeiras
              não serão apagados. Os restantes serão removidos definitivamente.
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending || selectedIds.length === 0}
            onClick={handleConfirm}
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A eliminar...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Eliminar {selectedIds.length} Produto(s)</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
