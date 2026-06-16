"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, Input } from "@/components";
import { toast } from "sonner";
import {
  FINAL_CONSUMER_TAX_NUMBER,
  isValidAngolanTaxNumber,
  normalizeTaxNumber,
  TAXPAYER_STATUS_LABELS,
  VAT_REGIME_LABELS,
} from "@/lib/contributor";
import { ContributorVerificationError } from "@/services/contributor-service";
import { useContributorVerification } from "@/hooks/contributors/use-contributor-verification";
import type {
  ContributorVerificationStatus,
  VerifiedContributor,
} from "@/types/contributor";
import { cn } from "@/lib/utils";

interface NifVerificationFieldProps {
  value: string;
  onChange: (value: string) => void;
  onVerified: (contributor: VerifiedContributor) => void;
  onStatusChange?: (status: ContributorVerificationStatus) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  verificationEnabled?: boolean;
}

export function NifVerificationField({
  value,
  onChange,
  onVerified,
  onStatusChange,
  label = "NIF",
  placeholder = "Introduza o NIF",
  error,
  disabled,
  className,
  name,
  verificationEnabled = true,
}: NifVerificationFieldProps) {
  const [status, setStatus] = useState<ContributorVerificationStatus>("idle");
  const [contributor, setContributor] = useState<VerifiedContributor | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const requestSequence = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const { mutateAsync: verifyContributor } = useContributorVerification();

  const updateStatus = useCallback(
    (nextStatus: ContributorVerificationStatus) => {
      setStatus(nextStatus);
      onStatusChange?.(nextStatus);
    },
    [onStatusChange],
  );

  const verify = useCallback(async () => {
    const normalized = normalizeTaxNumber(value);
    const toastId = `nif-verification-${normalized}`;
    if (
      !verificationEnabled ||
      normalized === FINAL_CONSUMER_TAX_NUMBER ||
      !isValidAngolanTaxNumber(normalized)
    ) {
      return;
    }

    controller.current?.abort();
    const currentController = new AbortController();
    controller.current = currentController;
    const sequence = ++requestSequence.current;

    setContributor(null);
    setMessage(null);
    updateStatus("checking");

    try {
      const result = await verifyContributor({
        taxNumber: normalized,
        signal: currentController.signal,
      });
      if (sequence !== requestSequence.current) return;

      setContributor(result);
      toast.dismiss(toastId);
      updateStatus(result.hasRestrictions ? "restricted" : "verified");
      onVerified(result);
    } catch (error) {
      if (currentController.signal.aborted || sequence !== requestSequence.current) return;

      if (
        error instanceof ContributorVerificationError &&
        error.code === "TAXPAYER_NOT_FOUND"
      ) {
        setMessage(error.message);
        updateStatus("not_found");
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível verificar o NIF neste momento.";

      toast.warning("Não foi possível verificar o NIF", {
        id: toastId,
        description: `${errorMessage} Pode continuar e preencher os dados manualmente.`,
        duration: 10_000,
      });
      updateStatus("unavailable");
    }
  }, [onVerified, updateStatus, value, verificationEnabled, verifyContributor]);

  useEffect(() => {
    const normalized = normalizeTaxNumber(value);
    requestSequence.current += 1;
    controller.current?.abort();
    setContributor(null);
    setMessage(null);

    if (
      !verificationEnabled ||
      !normalized ||
      normalized === FINAL_CONSUMER_TAX_NUMBER ||
      !isValidAngolanTaxNumber(normalized)
    ) {
      updateStatus("idle");
      return;
    }

    updateStatus("checking");
    const timer = window.setTimeout(() => void verify(), 500);
    return () => window.clearTimeout(timer);
  }, [value, verificationEnabled, verify, updateStatus]);

  useEffect(() => () => controller.current?.abort(), []);

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        name={name}
        label={label}
        startIcon="IdCard"
        value={value}
        onChange={(event) => onChange(normalizeTaxNumber(event.target.value))}
        placeholder={placeholder}
        maxLength={14}
        autoCapitalize="characters"
        spellCheck={false}
        disabled={disabled}
        error={error}
      />

      {status === "checking" && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
          <Icon name="LoaderCircle" className="h-3.5 w-3.5 animate-spin" />
          A verificar o NIF na SETIC-FP...
        </p>
      )}

      {(status === "verified" || status === "restricted") && contributor && (
        <div
          className={cn(
            "rounded-md border px-3 py-2 text-xs",
            status === "restricted"
              ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
              : "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200",
          )}
        >
          <p className="flex items-center gap-2 font-medium">
            <Icon
              name={status === "restricted" ? "TriangleAlert" : "CircleCheck"}
              className="h-3.5 w-3.5"
            />
            {status === "restricted"
              ? `Contribuinte ${TAXPAYER_STATUS_LABELS[contributor.status].toLowerCase()}. A operação pode continuar.`
              : "NIF confirmado com sucesso."}
          </p>
          <p className="mt-1 opacity-80">
            {TAXPAYER_STATUS_LABELS[contributor.status]} · {VAT_REGIME_LABELS[contributor.vatRegime]}
            {contributor.nonResident ? " · Não residente" : ""}
          </p>
        </div>
      )}

      {status === "not_found" && (
        <p className="flex items-center gap-2 text-xs text-destructive" role="alert">
          <Icon name="CircleX" className="h-3.5 w-3.5" />
          {message}
        </p>
      )}

    </div>
  );
}
