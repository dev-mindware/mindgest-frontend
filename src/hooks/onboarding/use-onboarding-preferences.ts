"use client";

import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  OnboardingTourId,
  OnboardingTourMode,
} from "@/constants/onboarding-tours";
import { onboardingTours } from "@/constants/onboarding-tours";
import {
  onboardingService,
  type UpdateOnboardingPreferencesPayload,
  type UpdateOnboardingTourPayload,
} from "@/services/onboarding-service";
import { useOnboardingPreferencesStore } from "@/stores";

const ONBOARDING_QUERY_KEY = ["onboarding-preferences"] as const;

function reportPersistenceError(error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("Não foi possível sincronizar os guias com a API.", error);
  }
}

export function useOnboardingPreferencesPersistence(
  scope: string,
  enabled = true,
) {
  const queryClient = useQueryClient();
  const hydratePreferences = useOnboardingPreferencesStore(
    (state) => state.hydratePreferences,
  );

  const query = useQuery({
    queryKey: [...ONBOARDING_QUERY_KEY, scope],
    queryFn: onboardingService.getPreferences,
    enabled,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!query.data) return;

    const seenTours: Partial<
      Record<OnboardingTourId, "completed" | "skipped">
    > = {};

    for (const [tourId, progress] of Object.entries(query.data.tours)) {
      const id = tourId as OnboardingTourId;
      const currentTour = onboardingTours[id];
      if (!currentTour || !progress) continue;
      if (
        progress.tourVersion !== undefined &&
        progress.tourVersion < currentTour.version
      ) {
        continue;
      }
      if (progress.status === "completed" || progress.status === "skipped") {
        seenTours[id] = progress.status;
      }
    }

    hydratePreferences(scope, {
      ...query.data.preferences,
      seenTours,
    });
  }, [hydratePreferences, query.data, scope]);

  const { mutate: mutatePreferences } = useMutation({
    mutationFn: (payload: UpdateOnboardingPreferencesPayload) =>
      onboardingService.updatePreferences(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...ONBOARDING_QUERY_KEY, scope],
      }),
    onError: reportPersistenceError,
  });

  const { mutate: mutateTour } = useMutation({
    mutationFn: ({
      tourId,
      payload,
    }: {
      tourId: OnboardingTourId;
      payload: UpdateOnboardingTourPayload;
    }) => onboardingService.updateTour(tourId, payload),
    onError: reportPersistenceError,
  });

  const { mutate: mutateResetTour } = useMutation({
    mutationFn: onboardingService.resetTour,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...ONBOARDING_QUERY_KEY, scope],
      }),
    onError: reportPersistenceError,
  });

  const { mutate: mutateResetAll } = useMutation({
    mutationFn: onboardingService.resetAllTours,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...ONBOARDING_QUERY_KEY, scope],
      }),
    onError: reportPersistenceError,
  });

  const persistPreferences = useCallback(
    (payload: UpdateOnboardingPreferencesPayload) =>
      mutatePreferences(payload),
    [mutatePreferences],
  );
  const persistTour = useCallback(
    (
      tourId: OnboardingTourId,
      status: UpdateOnboardingTourPayload["status"],
      mode: OnboardingTourMode,
      tourVersion: number,
      lastStepIndex?: number,
    ) =>
      mutateTour({
        tourId,
        payload: { status, mode, tourVersion, lastStepIndex },
      }),
    [mutateTour],
  );
  const persistResetTour = useCallback(
    (tourId: OnboardingTourId) => mutateResetTour(tourId),
    [mutateResetTour],
  );
  const persistResetAllTours = useCallback(
    () => mutateResetAll(),
    [mutateResetAll],
  );

  return {
    isHydrating: query.isLoading,
    persistPreferences,
    persistTour,
    persistResetTour,
    persistResetAllTours,
  };
}
