"use client";
import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GlobalModal,
  Input,
  Button,
  RHFSelect,
  RequestError,
  Textarea,
  InputCurrency,
} from "@/components";
import { useModal } from "@/stores";
import { useGetStoresPaginated } from "@/hooks/entities";
import { useGetCashiersPaginated } from "@/hooks/collaborators/cashier";
import { cn } from "@/lib/utils";
import { PosOpeningFormData, posOpeningSchema } from "@/schemas/pos-opening";
import { useCurrentCashierStore } from "@/stores/pos/current-cashier-store";
import { useOpenCashSession, useUpdateCashSession } from "@/hooks/entities";
import { SucessMessage, ErrorMessage, formatCurrency, parseCurrency } from "@/utils";
import { PaginatedSelect } from "@/components/shared/filters/paginated-select";
import { MultiSelect } from "@/components/common/input-fetch/async-multi-select";
import { useAuth } from "@/hooks/auth";

interface PosOpeningModalProps {
  /** Quando true, o utilizador logado (Owner/Manager) abre sessão para si próprio.
   *  O select de caixas fica oculto e o cashierId é injetado automaticamente. */
  selfSessionMode?: boolean;
  /** Chamado após abertura ou atualização de sessão com sucesso. */
  onSuccess?: () => void;
}

export function PosOpeningModal({ selfSessionMode = false, onSuccess }: PosOpeningModalProps) {
  const { closeModal } = useModal();
  const { currentCashier, setCurrentCashier } = useCurrentCashierStore();
  const [storePage, setStorePage] = useState(1);

  const {
    data: storesData,
    isLoading: isLoadingStores,
    isError: storesError,
    totalPages: storeTotalPages,
    refetch: refetchStores,
  } = useGetStoresPaginated(storePage, 10, "OWNER");

  const { mutateAsync: openSession, isPending: isOpening } = useOpenCashSession();
  const { mutateAsync: updateSession, isPending: isUpdating } = useUpdateCashSession();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PosOpeningFormData>({
    resolver: zodResolver(posOpeningSchema),
    defaultValues: {
      initialCapital: "",
      workTime: "06:00",
      storeId: "",
      // No selfSessionMode, o cashierId do próprio gestor é injetado depois de obter o user
      cashierIds: [],
      fundType: "Coin",
      reason: "",
    },
  });

  const selectedStoreId = watch("storeId");

  const {
    data: allCashiers,
    isLoading: isLoadingCashiers,
  } = useGetCashiersPaginated(1, 100, "", selectedStoreId);

  const { user } = useAuth();

  const cashierOptions = useMemo(() => {
    const cashiersList = allCashiers || [];
    const opts = cashiersList.map((c) => ({
      label: `${c.name} (${c.email})`,
      value: c.id,
    }));

    if (user && (user.role === "OWNER" || user.role === "MANAGER")) {
      if (!opts.some((opt) => opt.value === user.id)) {
        opts.unshift({
          label: `${user.name} (${user.email} - Tu/Gestor)`,
          value: user.id,
        });
      }
    }
    return opts;
  }, [allCashiers, user]);

  const isEdit = !!currentCashier;

  // No selfSessionMode, injeta o id do utilizador logado nos cashierIds ao montar
  useEffect(() => {
    if (selfSessionMode && user?.id) {
      setValue("cashierIds", [user.id]);
    }
  }, [selfSessionMode, user, setValue]);

  useEffect(() => {
    if (isEdit && currentCashier) {
      // Normalize fundType from API (e.g. "COIN" -> "Coin", "NOTE" -> "Note")
      const normalizedFundType = currentCashier.fundType
        ? currentCashier.fundType.charAt(0).toUpperCase() + currentCashier.fundType.slice(1).toLowerCase()
        : "Coin";

      reset({
        initialCapital: (currentCashier.openingCash || 0).toString(),
        workTime: currentCashier.workTime || "06:00",
        storeId: currentCashier.storeId || "",
        cashierIds: currentCashier.userId ? [currentCashier.userId] : [],
        fundType: normalizedFundType,
        reason: "",
      });
    } else if (!selfSessionMode) {
      reset({
        initialCapital: "",
        workTime: "06:00",
        storeId: "",
        cashierIds: [],
        fundType: "Coin",
        reason: "",
      });
    }
  }, [isEdit, currentCashier, reset, selfSessionMode]);

  const selectedCashierIds = watch("cashierIds") || [];

  const handleClose = () => {
    reset();
    setCurrentCashier(null);
    closeModal("opening-cashier");
  };

  const onSubmit = async (data: PosOpeningFormData) => {
    try {
      if (isEdit && currentCashier) {
        if (!data.reason?.trim()) {
          ErrorMessage("A razão da edição é obrigatória.");
          return;
        }
        const payload = {
          openingCash: parseFloat(data.initialCapital),
          reason: data.reason,
        };
        await updateSession({ id: currentCashier.id.toString(), data: payload });
      } else {
        const payload = {
          ...data,
          fundType: data.fundType?.toUpperCase(),
        };
        await openSession(payload);
      }
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      // Errors are handled by the mutation's onError
    }
  };

  if (isLoadingStores) {
    return (
      <GlobalModal id="opening-cashier" title="Abertura de Caixa" canClose>
        <div className="p-8 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            A carregar lojas...
          </p>
        </div>
      </GlobalModal>
    );
  }

  if (storesError) {
    return (
      <GlobalModal id="opening-cashier" title="Abertura de Caixa" canClose className="!w-max">
        <div className="p-4">
          <RequestError
            refetch={refetchStores}
            message="Ocorreu um erro ao carregar as lojas"
          />
        </div>
      </GlobalModal>
    );
  }

  return (
    <GlobalModal
      id="opening-cashier"
      title={isEdit ? "Editar configuração de caixa" : "Abertura de caixa"}
      description={
        isEdit
          ? "Edite as configurações da sessão deste caixa"
          : "Abra o caixa e acompanhe o fluxo de vendas dos seus colaboradores."
      }
      canClose
      className="sm:max-w-[600px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-1">
            <Controller
              name="initialCapital"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <InputCurrency
                  ref={ref}
                  label="Capital Inicial"
                  placeholder="0,00"
                  value={Number(value || 0)}
                  onValueChange={(val) => {
                    onChange(val.toString());
                  }}
                  error={errors.initialCapital?.message}
                />
              )}
            />
          </div>
          <div className="space-y-2 col-span-1">
            <Controller
              name="workTime"
              control={control}
              render={({ field }) => (
                <Input
                  type="time"
                  label="Tempo de Expediente"
                  startIcon="Clock"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isEdit}
                  error={errors.workTime?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2 col-span-1">
            <RHFSelect
              name="fundType"
              control={control}
              label="Tipo de Fundo"
              placeholder="Seleccione o tipo"
              disabled={isEdit}
              options={[
                { label: "Moeda", value: "Coin" },
                { label: "Nota", value: "Note" },
              ]}
            />
          </div>

          <div className="col-span-1">
            <Controller
              name="storeId"
              control={control}
              render={({ field }) => (
                <PaginatedSelect
                  label="Loja"
                  placeholder="Seleccione a loja"
                  options={storesData.map((s) => ({ label: s.name, value: s.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  isLoading={isLoadingStores}
                  disabled={isEdit}
                  pagination={{ page: storePage, totalPages: storeTotalPages }}
                  onPageChange={setStorePage}
                  fullWidth
                />
              )}
            />
            {errors.storeId && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mt-1">
                {errors.storeId.message}
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <Controller
              name="cashierIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Caixas Disponíveis para Abertura"
                  placeholder="Escolha os caixas"
                  options={allCashiers.map((c) => ({
                    label: `${c.name} (${c.email})`,
                    value: c.id,
                  }))}
                  isDisabled={isEdit}
                  value={allCashiers
                    .filter((c) => field.value?.includes(c.id))
                    .map((c) => ({ label: c.name, value: c.id }))}
                  onChange={(options) =>
                    field.onChange(options.map((opt) => opt.value))
                  }
                  isLoading={isLoadingCashiers}
                  error={errors.cashierIds?.message}
                />
              )}
            />
          </div>

          {isEdit && (
            <div className="col-span-1 md:col-span-2">
              <Textarea
                label="Razão da Edição"
                placeholder="Insira o motivo desta alteração..."
                {...register("reason")}
                error={errors.reason?.message}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-muted-foreground/5">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isOpening || isUpdating}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isEdit ? "Guardar alterações" : "Abrir caixa"}
          </Button>
        </div>
      </form>
    </GlobalModal>
  );
}
