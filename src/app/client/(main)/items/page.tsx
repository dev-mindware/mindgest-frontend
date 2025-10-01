import { ItemsPageContent, PageWrapper } from "@/components";
import { Suspense } from "react";

export default function Page() {
  return (
    <PageWrapper subRoute="Items">
      <Suspense fallback={<div>Loading...</div>}>
        <ItemsPageContent />
      </Suspense>
    </PageWrapper>
  );
}
