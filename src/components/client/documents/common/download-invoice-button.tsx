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
