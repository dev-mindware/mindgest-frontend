"use client";
import { PageWrapper, AllNotifications, TitleList } from "@/components";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PosNotificationsPage() {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="p-4 space-y-6 pb-20">
                <AllNotifications />
            </div>
        );
    }

    return (
        <PageWrapper subRoute="pos" variant="counter">
            <div className="space-y-6">
                <AllNotifications />
            </div>
        </PageWrapper>
    );
}
