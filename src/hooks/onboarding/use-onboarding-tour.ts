"use client";

import { useCallback, useEffect, useRef } from "react";
import { driver, type DriveStep, type Driver } from "driver.js";
import {
  onboardingTours,
  toDriveStep,
  type OnboardingDriveStep,
  type OnboardingTourId,
} from "@/constants/onboarding-tours";
import { useAuthStore } from "@/stores";

const STORAGE_PREFIX = "mindgest:onboarding:v1";
const ELEMENT_TIMEOUT_MS = 6000;
const ELEMENT_POLL_INTERVAL_MS = 150;
const TYPING_DELAY_MS = 70;

let activeDriver: Driver | null = null;
let activeTypingInterval: number | null = null;
let activeTypingTimeout: number | null = null;
let activeTypedInput: HTMLInputElement | null = null;
let activeDemoInputs: HTMLInputElement[] = [];
let activeRetryIntervals: number[] = [];

function canUseBrowserStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getScope(userId?: string, companyId?: string) {
  return [companyId || "company", userId || "user"].join(":");
}

function getStorageKey(
  tourId: OnboardingTourId,
  userId?: string,
  companyId?: string,
) {
  return `${STORAGE_PREFIX}:${getScope(userId, companyId)}:${tourId}`;
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

function getFirstInput(root: ParentNode | null) {
  return root?.querySelector<HTMLInputElement>("input:not([type='hidden'])") ?? null;
}

function getPosSearchInput() {
  return document.querySelector<HTMLInputElement>(
    '[data-tour="pos-product-search"]',
  );
}

function clickOption(option: HTMLElement) {
  option.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  option.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  option.click();
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
      !text.includes("buscando") &&
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

function waitForElement(selector: string, timeoutMs = ELEMENT_TIMEOUT_MS) {
  return new Promise<Element | null>((resolve) => {
    const firstMatch = document.querySelector(selector);
    if (firstMatch) {
      resolve(firstMatch);
      return;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const element = document.querySelector(selector);
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
        (step.selector.includes("pos-customer") ||
          step.selector.includes("pos-new-customer-phone") ||
          step.selector.includes("pos-payment-methods"))
      ) {
        return null;
      }

      return toDriveStep(step);
    })
    .filter((step): step is DriveStep => Boolean(step));
}

async function prepareTarget(selector: string) {
  let targetElement = document.querySelector(selector);
  if (targetElement) return targetElement;

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
      selector.includes("pos-submit"))
  ) {
    document.querySelector<HTMLButtonElement>('[data-tour="pos-cart"]')?.click();
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
  const nextIndex = currentIndex + 1;
  const steps = driver.getConfig().steps ?? [];
  const nextStep = steps[nextIndex];

  clearActiveTyping();

  if (!nextStep) {
    driver.destroy();
    return;
  }

  if (typeof nextStep.element === "string") {
    await prepareTarget(nextStep.element);
  }

  driver.moveTo(nextIndex);
}

async function handlePrevClick(
  element: Element | undefined,
  step: DriveStep,
  { driver }: { driver: Driver },
) {
  const currentIndex = driver.getActiveIndex() ?? 0;
  const prevIndex = currentIndex - 1;
  const steps = driver.getConfig().steps ?? [];
  const prevStep = steps[prevIndex];

  clearActiveTyping();

  if (prevIndex < 0 || !prevStep) return;

  if (typeof prevStep.element === "string") {
    await prepareTarget(prevStep.element);
  }

  driver.moveTo(prevIndex);
}

function handleHighlighted(element: Element | undefined, step: DriveStep) {
  clearActiveTyping();
  if (!element) return;

  const demo = (step as OnboardingDriveStep).demo;

  if (demo === "normal-client-existing") {
    clearReactSelect(element);
    scheduleTyping(getFirstInput(element), "Consumidor", 300, () => {
      retrySelectAction(() => clickFirstExistingOption(element));
    });
    return;
  }

  if (demo === "normal-client-new") {
    const clientName = "Cliente Tour Novo";
    clearReactSelect(element);
    scheduleTyping(getFirstInput(element), clientName, 300, () => {
      retrySelectAction(() => clickCreateOption(element, clientName));
    });
    return;
  }

  if (demo === "normal-client-details") {
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
    return;
  }

  if (demo === "normal-product-existing") {
    clearReactSelect(element);
    scheduleTyping(getFirstInput(element), "Bebida", 300, () => {
      retrySelectAction(() => clickFirstExistingOption(element));
    });
    return;
  }

  if (demo === "normal-product-new") {
    const itemName = "Servico Tour Novo";
    clearReactSelect(element);
    scheduleTyping(getFirstInput(element), itemName, 300, () => {
      retrySelectAction(() => clickCreateOption(element, itemName));
    });
    return;
  }

  if (demo === "normal-product-details") {
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
    return;
  }

  if (demo === "pos-products-search") {
    scheduleTyping(getPosSearchInput(), "Bebida");
    return;
  }

  if (demo === "pos-client-existing") {
    openPosCustomerSection(element);
    activeTypingTimeout = window.setTimeout(() => {
      activeTypingTimeout = null;
      const input = getFirstInput(element);
      if (input) {
        simulateTyping(input, "Consumidor", TYPING_DELAY_MS, () => {
          retrySelectAction(() => clickFirstExistingOption(element));
        });
      }
    }, 400);
    return;
  }

  if (demo === "pos-client-new") {
    const clientName = "Cliente POS Tour";
    openPosCustomerSection(element);
    clearReactSelect(element);
    activeTypingTimeout = window.setTimeout(() => {
      activeTypingTimeout = null;
      const input = getFirstInput(element);
      if (input) {
        simulateTyping(input, clientName, TYPING_DELAY_MS, () => {
          retrySelectAction(() => clickCreateOption(element, clientName));
        });
      }
    }, 400);
    return;
  }

  if (demo === "pos-client-details") {
    setDemoInputValue(getFirstInput(element), "923000000");
  }
}

export function useOnboardingTour(tourId: OnboardingTourId) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const companyId = user?.company?.id;

  const hasSeenTour = useCallback(() => {
    if (!canUseBrowserStorage()) return true;
    return (
      window.localStorage.getItem(getStorageKey(tourId, userId, companyId)) ===
      "completed"
    );
  }, [companyId, tourId, userId]);

  const markTourAsSeen = useCallback(() => {
    if (!canUseBrowserStorage()) return;
    window.localStorage.setItem(
      getStorageKey(tourId, userId, companyId),
      "completed",
    );
  }, [companyId, tourId, userId]);

  const startTour = useCallback(async () => {
    if (typeof window === "undefined") return;

    const steps = resolveSteps(tourId);
    if (steps.length === 0) return;

    const firstStep = steps[0];
    if (typeof firstStep.element === "string") {
      await prepareTarget(firstStep.element);
    }

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
      onHighlighted: handleHighlighted,
      onDeselected: clearActiveTyping,
      onDestroyed: () => {
        clearActiveTyping();
        markTourAsSeen();
        activeDriver = null;
      },
    });

    activeDriver.drive();
  }, [markTourAsSeen, tourId]);

  return {
    startTour,
    hasSeenTour,
    markTourAsSeen,
  };
}

export function useAutoOnboardingTour(
  tourId: OnboardingTourId,
  enabled = true,
) {
  const { startTour, hasSeenTour } = useOnboardingTour(tourId);
  const user = useAuthStore((state) => state.user);
  const autoStartRef = useRef(false);

  useEffect(() => {
    if (!enabled || !user || autoStartRef.current || hasSeenTour()) return;
    if (typeof window === "undefined") return;

    autoStartRef.current = true;

    const timeout = window.setTimeout(() => {
      startTour();
    }, 700);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [enabled, hasSeenTour, startTour, tourId, user]);
}
