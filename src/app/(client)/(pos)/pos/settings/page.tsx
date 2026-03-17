"use client";
import { PageWrapper } from "@/components";
import { PosSettingsSetup } from "@/components/client/pos";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PosSettingsPage() {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <PosSettingsSetup />;
    }

    return (
        <PageWrapper subRoute="pos" variant="counter">
            <PosSettingsSetup />
        </PageWrapper>
    );
}
