"use client";
import { useModal } from "@/stores/modal/use-modal-store";
import { Icon, Button, DetailRow, GlobalModal, Badge } from "@/components";
import { formatDateTime } from "@/utils/format-date";
import { currentCollaboratorStore } from "@/stores/collaborators/current-collaborator-store";

export function DetailsCollaboratorModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["view-collaborator"];
  const { currentCollaborator } = currentCollaboratorStore();

  if (!currentCollaborator || !isOpen) return null;

  return (
    <GlobalModal
      canClose
      id="view-collaborator"
      title={
        <>
          <div className="flex items-center justify-center mx-auto rounded-full w-20 h-20 bg-primary/10">
            <Icon name="User" className="w-10 h-10 text-primary" />
          </div>

          <div className="text-center space-y-1 mt-4">
            <h2 className="text-2xl font-bold">{currentCollaborator.name}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">
                Cargo: {currentCollaborator.role}
              </span>
              <Badge
                variant={
                  currentCollaborator.status === "ACTIVE"
                    ? "success"
                    : "destructive"
                }
              >
                {currentCollaborator.status === "ACTIVE"
                  ? "Activo"
                  : "Inactivo"}
              </Badge>
            </div>
          </div>
        </>
      }
      className="!max-w-md !w-[90vw] md:!w-full"
      footer={
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => closeModal("view-collaborator")}
          >
            Fechar
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        <section className="space-y-2">
          <h3 className="font-semibold text-foreground">
            Informações Pessoais
          </h3>
          <DetailRow label="Nome" value={currentCollaborator.name} />
          <DetailRow label="Email" value={currentCollaborator.email} />
          <DetailRow label="Telefone" value={currentCollaborator.phone} />
        </section>

        {/* Empresa e Identificação */}
        {currentCollaborator.companyId && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">
              Identificação e Empresa
            </h3>
            <DetailRow label="Empresa" value={currentCollaborator.companyId} />
          </section>
        )}

        {(currentCollaborator.createdAt || currentCollaborator.updatedAt) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">
              Informações Técnicas
            </h3>
            <DetailRow
              label="Criado em"
              value={formatDateTime(currentCollaborator.createdAt)}
            />
            <DetailRow
              label="Atualizado em"
              value={formatDateTime(currentCollaborator.updatedAt)}
            />
          </section>
        )}
      </div>
    </GlobalModal>
  );
}
