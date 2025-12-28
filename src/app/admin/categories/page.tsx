import { PageWrapper } from "@/components";
import { CategoriesPageContent } from "@/components/clients/categories";
import { Suspense } from "react";

export default function Page() {
  return (
    <PageWrapper subRoute="Categorias">
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesPageContent />
      </Suspense>
    </PageWrapper>
  );
}
