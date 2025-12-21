"use client";
import { TitleList } from "@/components/common";
import { useFetchById } from "@/hooks/common";
import { CreditNoteForm } from "./credfit-notes-form";
import { InvoiceDetails } from "@/types/credit-note";

export function CreditNotes({ noteId }: { noteId: string }) {
  const { data, isLoading, isError } = useFetchById<InvoiceDetails>(
    "invoice",
    "/invoice/normal",
    noteId
  );

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar</div>;
  if (!data) return <div>Não encontrado</div>;

  return (
    <div className="space-y-6">
      <TitleList
        title="Notas de Crédito"
        suTitle="Emita notas de crédito para as suas faturas."
      />
      <CreditNoteForm invoice={data} />
    </div>
  );
}
