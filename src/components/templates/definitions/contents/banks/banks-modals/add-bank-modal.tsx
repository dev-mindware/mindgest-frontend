"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, RotateCcw, PenLine, Building2 } from "lucide-react";
import { ErrorMessage } from "@/utils/messages";
import { currentBankStore, useModal } from "@/stores";
import { BankFormData, bankSchema } from "@/schemas/bank-schema";
import { useAddBank, useUpdateBank } from "@/hooks/banks";
import {
  ANGOLAN_BANKS,
  CUSTOM_BANK_VALUE,
  findBankByName,
} from "@/constants/banks";
import {
  Input,
  Button,
  Checkbox,
  ButtonSubmit,
  GlobalModal,
  SelectField,
} from "@/components";

type BankModalProps = {
  action: "add" | "edit";
};

export function BankModal({ action }: BankModalProps) {
  const { closeModal, open } = useModal();
  const isOpen = open["add-bank"] || open["edit-bank"];
  const { currentBank } = currentBankStore();

  const { mutateAsync: addBank, isPending: isAdding } = useAddBank();
  const { mutateAsync: editBank, isPending: isEditing } = useUpdateBank();

  const [isCustom, setIsCustom] = useState(false);
  const [customBankCode, setCustomBankCode] = useState("");

  const bankOptions = useMemo(() => {
    const list = ANGOLAN_BANKS.map((b) => ({
      value: b.name,
      label: `${b.name} — ${b.fullName}`,
    }));

    if (
      action === "edit" &&
      currentBank &&
      !ANGOLAN_BANKS.some(
        (b) =>
          b.name.toUpperCase() === currentBank.bankName.toUpperCase() ||
          b.fullName.toUpperCase() === currentBank.bankName.toUpperCase(),
      )
    ) {
      list.unshift({
        value: currentBank.bankName,
        label: `${currentBank.bankName} (Personalizado)`,
      });
    }

    list.push({
      value: CUSTOM_BANK_VALUE,
      label: "✏️ Outro Banco (Personalizado)...",
    });

    return list;
  }, [action, currentBank]);

  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    mode: "onChange",
    defaultValues: {
      bankName: "",
      accountNumber: "",
      iban: "",
      phone: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (action === "edit" && currentBank) {
      const preset = findBankByName(currentBank.bankName);
      if (preset) {
        setIsCustom(false);
        setCustomBankCode(preset.code);
        reset({
          bankName: preset.name,
          accountNumber: currentBank.accountNumber,
          iban: currentBank.iban,
          phone: currentBank.phone || "",
          isDefault: currentBank.isDefault,
        });
      } else {
        setIsCustom(true);
        setCustomBankCode("");
        reset({
          bankName: currentBank.bankName,
          accountNumber: currentBank.accountNumber,
          iban: currentBank.iban,
          phone: currentBank.phone || "",
          isDefault: currentBank.isDefault,
        });
      }
    } else if (action === "add") {
      setIsCustom(false);
      setCustomBankCode("");
    }
  }, [action, currentBank, reset, isOpen]);

  const handleCustomCodeChange = (codeVal: string) => {
    const digits = codeVal.replace(/\D/g, "").slice(0, 4);
    setCustomBankCode(digits);
    if (digits.length === 4) {
      const currentIban = watch("iban") || "";
      if (!currentIban || currentIban.startsWith("AO06.")) {
        setValue("iban", `AO06.${digits}.`);
      }
    }
  };

  const handleSwitchToCustom = () => {
    setIsCustom(true);
    setValue("bankName", "");
    const currentIban = watch("iban");
    if (!currentIban) {
      setValue("iban", "AO06.");
    }
  };

  const handleSwitchToPreset = () => {
    setIsCustom(false);
    setCustomBankCode("");
    setValue("bankName", "");
  };

  async function onSubmit(data: BankFormData) {
    try {
      if (action === "add") {
        await addBank(data);
        reset();
      } else if (action === "edit" && currentBank) {
        await editBank({ id: currentBank.id, data });
      }
      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Não foi possível guardar o banco.",
      );
    }
  }

  const handleCancel = () => {
    reset();
    setIsCustom(false);
    setCustomBankCode("");
    closeModal(action === "add" ? "add-bank" : "edit-bank");
  };

  if ((action === "edit" && !currentBank) || !isOpen) return null;

  return (
    <GlobalModal
      canClose
      id={action === "add" ? "add-bank" : "edit-bank"}
      title={action === "add" ? "Adicionar Banco" : "Editar Banco"}
      className="!max-w-md !w-[90vw] md:!w-full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 max-h-[80vh] overflow-y-auto px-1 pb-1"
      >
        {/* Bloco de Seleção / Personalização do Banco */}
        {isCustom ? (
          <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-3.5 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Banco Personalizado</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={handleSwitchToPreset}
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Escolher da lista
              </Button>
            </div>

            <div>
              <Input
                label="Nome do Banco"
                placeholder="ex: Santander, Caixa Geral de Depósitos, Wise..."
                {...register("bankName")}
                error={errors.bankName?.message}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Insira o nome ou sigla da sua instituição financeira.
              </p>
            </div>

            <div className="space-y-1 pt-1 border-t border-border/50">
              <label className="text-xs font-medium text-foreground">
                Código Bancário (4 dígitos, opcional)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="0000"
                  maxLength={4}
                  value={customBankCode}
                  onChange={(e) => handleCustomCodeChange(e.target.value)}
                  className="w-24 text-center font-mono tracking-wider"
                />
                <span className="text-[11px] text-muted-foreground leading-tight">
                  Se for uma instituição em Angola, preenche o prefixo do IBAN (ex: AO06.0000.).
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Controller
              name="bankName"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Nome do Banco"
                  value={field.value}
                  onValueChange={(val) => {
                    if (val === CUSTOM_BANK_VALUE) {
                      handleSwitchToCustom();
                      return;
                    }
                    field.onChange(val);
                    if (action === "add") {
                      const bank = ANGOLAN_BANKS.find((b) => b.name === val);
                      if (bank) {
                        setValue("iban", `AO06.${bank.code}.`);
                      }
                    }
                  }}
                  options={bankOptions}
                  placeholder="Seleccione o banco da lista"
                />
              )}
            />
            {errors.bankName && (
              <p className="text-xs text-red-500">{errors.bankName.message}</p>
            )}

            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={handleSwitchToCustom}
                className="group flex items-center gap-1 text-[11px] font-medium text-primary hover:underline transition-colors"
              >
                <PenLine className="h-3 w-3 transition-transform group-hover:scale-110" />
                Não encontrou o seu banco no acervo? Digitar manualmente
              </button>
            </div>
          </div>
        )}

        <Input
          label="Número da Conta"
          placeholder="ex: 12345678901234"
          {...register("accountNumber")}
          error={errors.accountNumber?.message}
        />

        <Input
          label="IBAN"
          placeholder="AO06.0040.0000.5660.0824.1017.4"
          {...register("iban")}
          error={errors.iban?.message}
        />

        <Input
          label="Express (Opcional)"
          placeholder="Nº de telemóvel associado ao Multicaixa Express"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3.5 bg-muted/20">
          <Checkbox
            checked={watch("isDefault")}
            onCheckedChange={(checked) =>
              setValue("isDefault", checked as boolean)
            }
          />
          <div className="space-y-1 leading-none">
            <label className="text-xs font-medium leading-none cursor-pointer">
              Definir como Banco Padrão
            </label>
            <p className="text-[11px] text-muted-foreground">
              Esta conta bancária será exibida como padrão na emissão de facturas e documentos.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            type="button"
            className="w-max"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <ButtonSubmit
            className="w-max"
            isLoading={isSubmitting || isAdding || isEditing}
          >
            {action === "add" ? "Adicionar Banco" : "Guardar alterações"}
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
