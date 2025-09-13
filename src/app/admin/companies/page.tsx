import { PageWrapper, TitleList } from "@/components";

export default function CompaniesPage() {
  return (
    <PageWrapper subRoute="Empresas">
      <TitleList
        title="Empresas"
        suTitle="Lista de empresas"
      />
      <div className="space-y-5">
      AQUI VIRA A LISTAGEM DAS EMPRESAS E TAL..
      </div>
    </PageWrapper>
  );
}
