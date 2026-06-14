"use client";

import { useCallback, useEffect, useRef } from "react";
import { driver, type DriveStep, type Driver } from "driver.js";
import {
  onboardingTours,
  toDriveStep,
  type OnboardingDriveStep,
  type OnboardingTourDemo,
  type OnboardingTourId,
  type OnboardingTourMode,
} from "@/constants/onboarding-tours";
import { useAuthStore, useOnboardingPreferencesStore } from "@/stores";
import { PLAN_HIERARCHY, type User } from "@/types";

const ELEMENT_TIMEOUT_MS = 6000;
const ELEMENT_POLL_INTERVAL_MS = 150;
const TYPING_DELAY_MS = 70;
const MOBILE_UNSUPPORTED_STEP_MARKERS = [
  "setup-workplace-tabs",
  "pos-customer",
  "pos-new-customer-phone",
  "pos-payment-methods",
];

let activeDriver: Driver | null = null;
let activeTypingInterval: number | null = null;
let activeTypingTimeout: number | null = null;
let activeTypedInput: HTMLInputElement | null = null;
let activeDemoInputs: HTMLInputElement[] = [];
let activeRetryIntervals: number[] = [];
let activeDemoCleanup: (() => void) | null = null;
let activeTourResult: "completed" | "skipped" | null = null;
let activeOriginalUrl: string | null = null;
let activeTourMode: OnboardingTourMode = "normal";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getScope(userId?: string, companyId?: string) {
  return [companyId || "company", userId || "user"].join(":");
}

function setInputValue(input: HTMLInputElement, value: string) {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;

  if (nativeSetter) {
    nativeSetter.call(input, value);
  } else {
    input.value = value;
  }

  const inputEvent =
    typeof InputEvent !== "undefined"
      ? new InputEvent("input", {
          bubbles: true,
          inputType: "insertText",
          data: value,
        })
      : new Event("input", { bubbles: true });

  input.dispatchEvent(inputEvent);
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function clearActiveTyping() {
  if (activeTypingInterval !== null) {
    window.clearInterval(activeTypingInterval);
    activeTypingInterval = null;
  }

  if (activeTypingTimeout !== null) {
    window.clearTimeout(activeTypingTimeout);
    activeTypingTimeout = null;
  }

  if (activeTypedInput) {
    setInputValue(activeTypedInput, "");
    activeTypedInput.blur();
    activeTypedInput = null;
  }

  activeRetryIntervals.forEach((interval) => window.clearInterval(interval));
  activeRetryIntervals = [];

  activeDemoInputs.forEach((input) => setInputValue(input, ""));
  activeDemoInputs = [];
}

function cleanupActiveDemo() {
  clearActiveTyping();

  if (activeDemoCleanup) {
    activeDemoCleanup();
    activeDemoCleanup = null;
  }

  if (activeOriginalUrl && window.location.href !== activeOriginalUrl) {
    window.history.replaceState(null, "", activeOriginalUrl);
  }
  activeOriginalUrl = null;
}

function simulateTyping(
  input: HTMLInputElement,
  text: string,
  delayMs = TYPING_DELAY_MS,
  onComplete?: () => void,
) {
  clearActiveTyping();

  activeTypedInput = input;
  input.focus({ preventScroll: true });
  setInputValue(input, "");

  let index = 0;
  let currentText = "";

  activeTypingInterval = window.setInterval(() => {
    if (index >= text.length) {
      if (activeTypingInterval !== null) {
        window.clearInterval(activeTypingInterval);
        activeTypingInterval = null;
      }
      onComplete?.();
      return;
    }

    currentText += text[index];
    setInputValue(input, currentText);
    index += 1;
  }, delayMs);
}

function scheduleTyping(
  input: HTMLInputElement | null,
  text: string,
  delayMs = 300,
  onComplete?: () => void,
) {
  clearActiveTyping();
  if (!input || typeof window === "undefined") return;

  activeTypingTimeout = window.setTimeout(() => {
    activeTypingTimeout = null;
    simulateTyping(input, text, TYPING_DELAY_MS, onComplete);
  }, delayMs);
}

function setDemoInputValue(input: HTMLInputElement | null, value: string) {
  if (!input) return;
  setInputValue(input, value);
  if (!activeDemoInputs.includes(input)) {
    activeDemoInputs.push(input);
  }
}

function rememberCurrentUrl() {
  if (!activeOriginalUrl && typeof window !== "undefined") {
    activeOriginalUrl = window.location.href;
  }
}

function clickSafe(element: HTMLElement | null) {
  if (!element) return false;
  element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  element.click();
  return true;
}

function typeIntoSelector(selector: string, value: string) {
  rememberCurrentUrl();
  const input = document.querySelector<HTMLInputElement>(selector);
  setDemoInputValue(input, value);
  return input;
}

function getFirstInput(root: ParentNode | null) {
  return root?.querySelector<HTMLInputElement>("input:not([type='hidden'])") ?? null;
}

function getPosSearchInput() {
  return document.querySelector<HTMLInputElement>(
    '[data-tour="pos-product-search"]',
  );
}

function clickOption(option: HTMLElement) {
  clickSafe(option);
}

function getSelectOptions(root: ParentNode | null) {
  const scopedOptions = Array.from(
    root?.querySelectorAll<HTMLElement>(".react-select__option") ?? [],
  );

  if (scopedOptions.length > 0) {
    return scopedOptions;
  }

  return Array.from(document.querySelectorAll<HTMLElement>(".react-select__option"));
}

function clickFirstExistingOption(root: ParentNode | null) {
  const option = getSelectOptions(root).find((item) => {
    const text = item.innerText.toLowerCase();
    return (
      text &&
      !text.includes("criar") &&
      !text.includes("adicionar") &&
      !text.includes("nenhum") &&
      !text.includes("a pesquisar") &&
      !text.includes("digite")
    );
  });

  if (option) {
    clickOption(option);
    return true;
  }

  return false;
}

function clickCreateOption(root: ParentNode | null, value: string) {
  const normalizedValue = value.toLowerCase();
  const option = getSelectOptions(root).find((item) => {
    const text = item.innerText.toLowerCase();
    return (
      text.includes(normalizedValue) &&
      (text.includes("criar") || text.includes("adicionar"))
    );
  });

  if (option) {
    clickOption(option);
    return true;
  }

  return false;
}

function retrySelectAction(action: () => boolean, attempts = 8) {
  let currentAttempt = 0;

  const interval = window.setInterval(() => {
    currentAttempt += 1;

    if (action() || currentAttempt >= attempts) {
      window.clearInterval(interval);
      activeRetryIntervals = activeRetryIntervals.filter((item) => item !== interval);
    }
  }, 250);

  activeRetryIntervals.push(interval);
}

function scheduleSelectDemo({
  root,
  searchText,
  shouldCreate,
  delayMs = 300,
}: {
  root: Element;
  searchText: string;
  shouldCreate?: boolean;
  delayMs?: number;
}) {
  clearReactSelect(root);
  scheduleTyping(getFirstInput(root), searchText, delayMs, () => {
    retrySelectAction(() =>
      shouldCreate
        ? clickCreateOption(root, searchText)
        : clickFirstExistingOption(root),
    );
  });
}

function clearReactSelect(root: ParentNode | null) {
  root?.querySelector<HTMLElement>(".react-select__clear-indicator")?.click();

  const input = getFirstInput(root);
  if (input) {
    setInputValue(input, "");
  }
}

function openPosCustomerSection(root: Element) {
  const toggleButton = root.querySelector<HTMLButtonElement>("button");
  const isExpanded = Boolean(root.querySelector(".space-y-4"));

  if (toggleButton && !isExpanded) {
    toggleButton.click();
  }
}

function clickSettingsTab(tabId: string) {
  clickSafe(
    document.querySelector<HTMLElement>(`[data-tour="setup-tab-${tabId}"]`),
  );
}

function clickPosSettingsTab(tabId: string) {
  clickSafe(
    document.querySelector<HTMLElement>(`[data-tour="pos-settings-tab-${tabId}"]`),
  );
}

async function openProductModalForTour() {
  if (findVisibleElement('[data-tour="product-modal"]')) return;

  clickSafe(
    document.querySelector<HTMLElement>('[data-tour="items-create"] button'),
  );

  const manualTrigger = await waitForElement(
    '[data-tour="items-create-manual"]',
    1000,
  );
  clickSafe(manualTrigger as HTMLElement | null);
}

function closeProductModalForTour() {
  clickSafe(
    document.querySelector<HTMLElement>('[data-tour="product-form-cancel"]'),
  );
}

function isElementVisible(element: Element) {
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.getClientRects().length > 0
  );
}

function findVisibleElement(selector: string) {
  return (
    Array.from(document.querySelectorAll(selector)).find(isElementVisible) ??
    null
  );
}

function canPrepareMissingStep(selector: string) {
  return (
    selector.includes("normal-invoice") ||
    selector.includes("pos-") ||
    selector.includes("setup-company-profile") ||
    selector.includes("setup-banks-content") ||
    selector.includes("setup-agt-content") ||
    selector.includes("setup-guides-content") ||
    selector.includes("product-") ||
    selector.includes("items-list")
  );
}

function waitForElement(selector: string, timeoutMs = ELEMENT_TIMEOUT_MS) {
  return new Promise<Element | null>((resolve) => {
    const firstMatch = findVisibleElement(selector);
    if (firstMatch) {
      resolve(firstMatch);
      return;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const element = findVisibleElement(selector);
      if (element) {
        window.clearInterval(interval);
        resolve(element);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(interval);
        resolve(null);
      }
    }, ELEMENT_POLL_INTERVAL_MS);
  });
}

function resolveSteps(tourId: OnboardingTourId): DriveStep[] {
  const tour = onboardingTours[tourId];
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  return tour.steps
    .map((step) => {
      if (
        isMobile &&
        MOBILE_UNSUPPORTED_STEP_MARKERS.some((marker) =>
          step.selector.includes(marker),
        )
      ) {
        return null;
      }

      const driveStep = toDriveStep(step);
      const visibleElement = findVisibleElement(step.selector);
      if (!visibleElement && !canPrepareMissingStep(step.selector)) {
        return null;
      }

      return visibleElement ? { ...driveStep, element: visibleElement } : driveStep;
    })
    .filter((step): step is DriveStep => Boolean(step));
}

export function canUserAccessOnboardingTour(
  tourId: OnboardingTourId,
  user?: User | null,
) {
  const tour = onboardingTours[tourId];
  if (!tour || !user) return false;
  if (user.role === "ADMIN") return true;
  if (!tour.roles.includes(user.role)) return false;

  const currentPlan = user.company?.subscription?.plan?.name ?? "Base";
  const currentPlanLevel = PLAN_HIERARCHY[currentPlan] ?? 0;
  const requiredPlanLevel = PLAN_HIERARCHY[tour.minPlan] ?? 0;

  return currentPlanLevel >= requiredPlanLevel;
}

type DemoHandler = (element: Element) => void;

const demoHandlers: Partial<Record<OnboardingTourDemo, DemoHandler>> = {
  "documents-filters": (element) => {
    rememberCurrentUrl();
    typeIntoSelector('[data-tour="documents-filter-search"] input', "Consumidor");
    typeIntoSelector('[data-tour="documents-filter-client"] input', "Cliente exemplo");
    typeIntoSelector('[data-tour="documents-filter-number"] input', "FT");
    clickSafe(
      element.querySelector<HTMLElement>('[data-tour="documents-filter-status"] button'),
    );
    activeDemoCleanup = () =>
      clickSafe(document.querySelector<HTMLElement>('[data-tour="documents-filter-clear"]'));
  },
  "normal-client-existing": (element) => {
    scheduleSelectDemo({
      root: element,
      searchText: "Consumidor",
    });
  },
  "normal-client-new": (element) => {
    scheduleSelectDemo({
      root: element,
      searchText: "Cliente de Demonstração",
      shouldCreate: true,
    });
  },
  "normal-client-details": (element) => {
    setDemoInputValue(
      element.querySelector<HTMLInputElement>('input[name="client.taxNumber"]'),
      "500000000",
    );
    setDemoInputValue(
      element.querySelector<HTMLInputElement>('input[name="client.phone"]'),
      "923000000",
    );
    setDemoInputValue(
      element.querySelector<HTMLInputElement>('input[name="client.address"]'),
      "Luanda, Angola",
    );
  },
  "normal-product-existing": (element) => {
    scheduleSelectDemo({
      root: element,
      searchText: "Bebida",
    });
  },
  "normal-product-new": (element) => {
    scheduleSelectDemo({
      root: element,
      searchText: "Serviço de Demonstração",
      shouldCreate: true,
    });
  },
  "normal-product-details": () => {
    setDemoInputValue(
      document.querySelector<HTMLInputElement>(
        '[data-tour="normal-invoice-item-quantity"] input',
      ),
      "1",
    );
    setDemoInputValue(
      document.querySelector<HTMLInputElement>(
        '[data-tour="normal-invoice-item-price"] input',
      ),
      "15000",
    );
  },
  "product-form-basics": () => {
    typeIntoSelector('[data-tour="product-form-name"] input', "Produto de Demonstração");
    typeIntoSelector('[data-tour="product-form-price"] input', "15000");
    typeIntoSelector('[data-tour="product-form-cost"] input', "10000");
    clickSafe(
      document.querySelector<HTMLElement>('[data-tour="product-form-category"] button'),
    );
  },
  "product-form-stock": () => {
    typeIntoSelector('[data-tour="product-form-quantity"] input', "5");
    typeIntoSelector('[data-tour="product-form-barcode"] input', "7891234567890");
    typeIntoSelector('[data-tour="product-form-min-stock"] input', "2");
    typeIntoSelector('[data-tour="product-form-max-stock"] input', "20");
  },
  "pos-management-filters": (element) => {
    rememberCurrentUrl();
    typeIntoSelector('[data-tour="pos-management-filter-search"] input', "caixa");
    clickSafe(
      element.querySelector<HTMLElement>('[data-tour="pos-management-filter-status"] button'),
    );
    activeDemoCleanup = () =>
      clickSafe(document.querySelector<HTMLElement>('[data-tour="pos-management-filter-clear"]'));
  },
  "pos-management-view": () => {
    const gridButton = document.querySelector<HTMLElement>(
      '[data-tour="pos-management-view-grid"]',
    );
    clickSafe(
      document.querySelector<HTMLElement>('[data-tour="pos-management-view-table"]'),
    );
    activeDemoCleanup = () => clickSafe(gridButton);
  },
  "reservations-calendar-view": () => {
    const monthButton = document.querySelector<HTMLElement>(
      '[data-tour="reservations-view-month"]',
    );
    clickSafe(document.querySelector<HTMLElement>('[data-tour="reservations-view-week"]'));
    clickSafe(document.querySelector<HTMLElement>('[data-tour="reservations-today"]'));
    activeDemoCleanup = () => clickSafe(monthButton);
  },
  "pos-products-search": () => {
    scheduleTyping(getPosSearchInput(), "Bebida");
  },
  "pos-client-existing": (element) => {
    openPosCustomerSection(element);
    activeTypingTimeout = window.setTimeout(() => {
      activeTypingTimeout = null;
      const input = getFirstInput(element);
      if (!input) return;

      simulateTyping(input, "Consumidor", TYPING_DELAY_MS, () => {
        retrySelectAction(() => clickFirstExistingOption(element));
      });
    }, 400);
  },
  "pos-client-new": (element) => {
    const clientName = "Cliente POS de Demonstração";
    openPosCustomerSection(element);
    clearReactSelect(element);
    activeTypingTimeout = window.setTimeout(() => {
      activeTypingTimeout = null;
      const input = getFirstInput(element);
      if (!input) return;

      simulateTyping(input, clientName, TYPING_DELAY_MS, () => {
        retrySelectAction(() => clickCreateOption(element, clientName));
      });
    }, 400);
  },
  "pos-client-details": (element) => {
    setDemoInputValue(getFirstInput(element), "923000000");
  },
};

async function prepareTarget(selector: string) {
  let targetElement = findVisibleElement(selector);
  if (targetElement) return targetElement;

  if (selector.includes("setup-company-profile")) {
    clickSettingsTab("profile");
  }

  if (selector.includes("setup-banks-content")) {
    clickSettingsTab("banks");
  }

  if (selector.includes("setup-agt-content")) {
    clickSettingsTab("agt");
  }

  if (selector.includes("setup-guides-content")) {
    clickSettingsTab("guides");
  }

  if (
    selector.includes("pos-settings-workspace") ||
    selector.includes("pos-settings-virtual-keyboard") ||
    selector.includes("pos-settings-external-scanner")
  ) {
    clickPosSettingsTab("workspace");
  }

  if (selector.includes("pos-settings-content-appearance")) {
    clickPosSettingsTab("appearance");
  }

  if (selector.includes("product-")) {
    await openProductModalForTour();
  }

  if (selector.includes("items-list")) {
    closeProductModalForTour();
  }

  if (selector.includes("normal-invoice") && !selector.includes("document-type")) {
    document.querySelector<HTMLButtonElement>('button[value="invoice"]')?.click();
  }

  if (
    selector.includes("pos-") &&
    (selector.includes("pos-cart") ||
      selector.includes("pos-payment-summary") ||
      selector.includes("pos-customer") ||
      selector.includes("pos-new-customer-phone") ||
      selector.includes("pos-payment-methods") ||
      selector.includes("pos-payment-cash-received") ||
      selector.includes("pos-payment-change") ||
      selector.includes("pos-submit"))
  ) {
    document.querySelector<HTMLButtonElement>('[data-tour="pos-cart"]')?.click();
  }

  if (
    selector.includes("pos-payment-cash-received") ||
    selector.includes("pos-payment-change")
  ) {
    document.querySelector<HTMLButtonElement>('[data-tour="pos-payment-method-cash"]')?.click();
  }

  if (
    selector.includes("pos-") &&
    (selector.includes("pos-categories") ||
      selector.includes("pos-products") ||
      selector.includes("pos-product-add"))
  ) {
    document.querySelector<HTMLButtonElement>('[data-tour="pos-back-to-menu"]')?.click();
  }

  targetElement = await waitForElement(selector, 1000);

  if (selector.includes("pos-new-customer-phone")) {
    const customerSection = document.querySelector('[data-tour="pos-customer"]');
    if (customerSection) {
      openPosCustomerSection(customerSection);
      targetElement = await waitForElement(selector, 1000);
    }
  }

  return targetElement;
}

async function handleNextClick(
  element: Element | undefined,
  step: DriveStep,
  { driver }: { driver: Driver },
) {
  const currentIndex = driver.getActiveIndex() ?? 0;
  cleanupActiveDemo();
  await moveToPreparedStep(driver, currentIndex + 1, 1);
}

async function handlePrevClick(
  element: Element | undefined,
  step: DriveStep,
  { driver }: { driver: Driver },
) {
  const currentIndex = driver.getActiveIndex() ?? 0;
  cleanupActiveDemo();
  await moveToPreparedStep(driver, currentIndex - 1, -1);
}

async function moveToPreparedStep(
  driver: Driver,
  startIndex: number,
  direction: 1 | -1,
) {
  const steps = driver.getConfig().steps ?? [];
  let targetIndex = startIndex;

  while (targetIndex >= 0 && targetIndex < steps.length) {
    const targetStep = steps[targetIndex];
    const selector =
      (targetStep as OnboardingDriveStep).selector ||
      (typeof targetStep.element === "string" ? targetStep.element : undefined);

    if (!selector) {
      driver.moveTo(targetIndex);
      return;
    }

    const preparedTarget = await prepareTarget(selector);
    if (preparedTarget) {
      targetStep.element = preparedTarget;
      driver.moveTo(targetIndex);
      return;
    }

    targetIndex += direction;
  }

  if (direction === 1) {
    activeTourResult = "completed";
    driver.destroy();
  }
}

function handleHighlighted(element: Element | undefined, step: DriveStep) {
  cleanupActiveDemo();
  if (!element) return;
  if (activeTourMode !== "demo") return;

  const demo = (step as OnboardingDriveStep).demo;
  if (!demo) return;

  demoHandlers[demo]?.(element);
}

export function useOnboardingTour(tourId: OnboardingTourId) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const companyId = user?.company?.id;
  const scope = getScope(userId, companyId);
  const canAccessTour = canUserAccessOnboardingTour(tourId, user);
  const getPreferences = useOnboardingPreferencesStore(
    (state) => state.getPreferences,
  );
  const markTourCompleted = useOnboardingPreferencesStore(
    (state) => state.markTourCompleted,
  );
  const markTourSkipped = useOnboardingPreferencesStore(
    (state) => state.markTourSkipped,
  );
  const scopedPreferences = useOnboardingPreferencesStore(
    (state) => state.preferencesByScope[scope],
  );
  const autoStartEnabled = scopedPreferences?.autoStartEnabled ?? true;
  const tourButtonEnabled = scopedPreferences?.tourButtonEnabled ?? true;
  const seenStatus = scopedPreferences?.seenTours?.[tourId];

  const hasSeenTour = useCallback(() => {
    return Boolean(getPreferences(scope).seenTours[tourId]);
  }, [getPreferences, scope, tourId]);

  const markTourAsSeen = useCallback(() => {
    markTourCompleted(scope, tourId);
  }, [markTourCompleted, scope, tourId]);

  const startTour = useCallback(async (mode: OnboardingTourMode = "normal") => {
    if (typeof window === "undefined") return;
    if (!canUserAccessOnboardingTour(tourId, user)) return;
    activeTourResult = null;
    activeTourMode = mode;

    const steps = resolveSteps(tourId);
    if (steps.length === 0) return;

    let initialStepIndex = 0;
    while (initialStepIndex < steps.length) {
      const firstStep = steps[initialStepIndex];
      const firstSelector =
        (firstStep as OnboardingDriveStep).selector ||
        (typeof firstStep.element === "string" ? firstStep.element : undefined);

      if (!firstSelector) break;

      const preparedTarget = await prepareTarget(firstSelector);
      if (preparedTarget) {
        firstStep.element = preparedTarget;
        break;
      }

      initialStepIndex += 1;
    }

    if (initialStepIndex >= steps.length) return;

    activeDriver?.destroy();

    activeDriver = driver({
      steps,
      animate: !prefersReducedMotion(),
      allowClose: true,
      allowKeyboardControl: true,
      disableActiveInteraction: true,
      overlayClickBehavior: "close",
      overlayOpacity: 0.55,
      stagePadding: 8,
      stageRadius: 12,
      popoverClass: "mindgest-tour-popover",
      showButtons: ["next", "previous", "close"],
      showProgress: true,
      progressText: "{{current}} de {{total}}",
      nextBtnText: "Seguinte",
      prevBtnText: "Anterior",
      doneBtnText: "Concluir",
      onNextClick: handleNextClick,
      onPrevClick: handlePrevClick,
      onCloseClick: (_, __, { driver }) => {
        activeTourResult = "skipped";
        driver.destroy();
      },
      onPopoverRender: (popover) => {
        popover.closeButton.innerText = "Pular";
        popover.closeButton.setAttribute("aria-label", "Ignorar guia");
      },
      onHighlighted: handleHighlighted,
      onDeselected: cleanupActiveDemo,
      onDestroyed: () => {
        cleanupActiveDemo();
        if (activeTourResult === "completed") {
          markTourCompleted(scope, tourId);
        } else if (getPreferences(scope).seenTours[tourId] !== "completed") {
          markTourSkipped(scope, tourId);
        }
        activeDriver = null;
        activeTourResult = null;
        activeTourMode = "normal";
      },
    });

    activeDriver.drive(initialStepIndex);
  }, [
    getPreferences,
    markTourCompleted,
    markTourSkipped,
    markTourAsSeen,
    scope,
    tourId,
    user,
  ]);

  return {
    startTour,
    hasSeenTour,
    markTourAsSeen,
    canAccessTour,
    autoStartEnabled,
    tourButtonEnabled,
    seenStatus,
  };
}

export function useCanAccessOnboardingTour(tourId: OnboardingTourId) {
  const user = useAuthStore((state) => state.user);
  return canUserAccessOnboardingTour(tourId, user);
}

export function useAutoOnboardingTour(
  tourId: OnboardingTourId,
  enabled = true,
) {
  const { startTour, hasSeenTour } = useOnboardingTour(tourId);
  const user = useAuthStore((state) => state.user);
  const scope = getScope(user?.id, user?.company?.id);
  const autoStartEnabled = useOnboardingPreferencesStore(
    (state) => state.preferencesByScope[scope]?.autoStartEnabled ?? true,
  );
  const autoStartRef = useRef(false);

  useEffect(() => {
    if (
      !enabled ||
      !autoStartEnabled ||
      !canUserAccessOnboardingTour(tourId, user) ||
      autoStartRef.current ||
      hasSeenTour()
    ) {
      return;
    }
    if (typeof window === "undefined") return;

    autoStartRef.current = true;

    const timeout = window.setTimeout(() => {
      startTour("normal");
    }, 700);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [autoStartEnabled, enabled, hasSeenTour, startTour, tourId, user]);
}
