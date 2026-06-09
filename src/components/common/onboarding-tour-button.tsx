"use client";

import { Icon } from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAutoOnboardingTour, useOnboardingTour } from "@/hooks/onboarding/use-onboarding-tour";
import type { OnboardingTourId } from "@/constants/onboarding-tours";

type OnboardingTourButtonProps = {
  tourId: OnboardingTourId;
  autoStart?: boolean;
  className?: string;
};

export function OnboardingTourButton({
  tourId,
  autoStart = true,
  className,
}: OnboardingTourButtonProps) {
  const { startTour, canAccessTour, tourButtonEnabled } =
    useOnboardingTour(tourId);

  useAutoOnboardingTour(tourId, autoStart);

  if (!canAccessTour || !tourButtonEnabled) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-2 border-primary/20 bg-background/80 text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5",
            className,
          )}
          onClick={startTour}
        >
          <Icon name="CircleHelp" className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Ver tour</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Ver guia deste fluxo</p>
      </TooltipContent>
    </Tooltip>
  );
}
