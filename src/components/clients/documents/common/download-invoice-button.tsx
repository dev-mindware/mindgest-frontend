"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { useDownloadInvoice } from "@/hooks/invoice";

export function DownloadInvoiceButton({ id }: { id: string }) {
  const { mutateAsync: downloadInvoice, isPending } = useDownloadInvoice();

  return (
    <div className="flex justify-end pt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isPending}>
            {isPending ? "Baixando..." : "Baixar fatura"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => downloadInvoice({ id, type: "pdf" })}
          >
            Documento PDF (.pdf)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => downloadInvoice({ id, type: "docx" })}
          >
            Documento Word (.docx)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => downloadInvoice({ id, type: "xml" })}
          >
            Documento Xml (.xml)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
