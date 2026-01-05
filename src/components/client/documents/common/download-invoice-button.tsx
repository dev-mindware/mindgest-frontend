"use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import type { DownloadType } from "@/types";
import { useDownloadDocument } from "@/hooks/common/use-download-document";
import type { DocumentType } from "@/types/documents";

type Props = {
  id: string;
  documentType: DocumentType;
  filenameBase: string;
};

export function DownloadDocumentButton({
  id,
  documentType,
  filenameBase,
}: Props) {
  const { mutate, isPending } = useDownloadDocument();

  function handleDownload(format: DownloadType) {
    mutate({
      id,
      documentType,
      format,
      filename: `${filenameBase}.${format}`,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isPending}>
          {isPending ? "Baixando..." : "Baixar documento"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownload("pdf")}>
          PDF (.pdf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload("docx")}>
          Word (.docx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload("xml")}>
          XML (.xml)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


/* "use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useDownloadInvoice } from "@/hooks/invoice";
import type { DownloadType } from "@/types";

type Props = {
  id: string;
  filename: string;
};

export function DownloadInvoiceButton({ id, filename }: Props) {
  const { mutate: downloadFile, isPending } = useDownloadInvoice();

  function handleDownload(type: DownloadType) {
    downloadFile({ id, type, filename });
  }

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
            disabled={isPending}
            onClick={() => handleDownload("pdf")}
          >
            Documento PDF (.pdf)
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isPending}
            onClick={() => handleDownload("docx")}
          >
            Documento Word (.docx)
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isPending}
            onClick={() => handleDownload("xml")}
          >
            Documento XML (.xml)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
 */