import { PageWrapper, ProductList } from "@/components";
import Link from "next/link";

export default function Page() {
  return (
    <PageWrapper subRoute="Documentos">
      <Link href="/client/documents/new">Novo</Link>
      <ProductList />
    </PageWrapper>
  );
}
