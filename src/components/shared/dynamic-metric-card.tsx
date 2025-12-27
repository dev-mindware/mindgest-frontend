"use client";

import { Card, CardContent, Icon, Skeleton } from "@/components";
import { cn } from "@/lib/utils";
import { icons } from "lucide-react";

interface DynamicMetricCardProps {
    title: string | number;
    subtitle: string;
    description?: string;
    icon?: keyof typeof icons;
    variant?: "default" | "action" | "interactive";
    className?: string;
    onClick?: () => void;
}

export function DynamicMetricCard({
    title,
    subtitle,
    description,
    icon,
    variant = "default",
    className,
    onClick,
}: DynamicMetricCardProps) {
    const isInteractive = onClick || variant === "interactive" || variant === "action";

    return (
        <Card
            onClick={onClick}
            className={cn(
                "border shadow-none cursor-default text-foreground overflow-hidden transition-all",
                variant === "action" && "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40",
                isInteractive && "cursor-pointer active:scale-[0.98]",
                className
            )}
        >
            <CardContent className="p-4 flex justify-between items-start h-full">
                <div className="flex flex-col h-full flex-1">
                    <div className="space-y-1">
                        <h2 className={cn(
                            "text-2xl font-bold tracking-tight",
                            variant === "action" && "text-primary"
                        )}>
                            {title}
                        </h2>
                        <p className={cn(
                            "text-lg text-foreground",
                            variant === "action" && "text-primary font-medium"
                        )}>
                            {subtitle}
                        </p>
                    </div>
                    {description && (
                        <p className="text-sm text-muted-foreground w-full font-medium mt-2">
                            {description}
                        </p>
                    )}
                </div>

                {icon && (
                    <div className={cn(
                        "p-2 rounded-md shrink-0",
                        variant === "action" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        <Icon name={icon as any} className="w-4 h-4" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function DynamicMetricCardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={cn("border shadow-none overflow-hidden rounded-none", className)}>
            <CardContent className="p-4 flex justify-between items-start h-full">
                <div className="flex flex-col h-full flex-1 space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md shrink-0 ml-4" />
            </CardContent>
        </Card>
    );
}
