import { PageWrapper } from "@/components";
import { PosManagementContent } from "@/components/clients/management/pos/pos-management-content";

export default function PosPage() {
    return (
        <PageWrapper subRoute="Gestão de POS">
            <PosManagementContent />
        </PageWrapper>
    );
}
