"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GlobalModal,
  Input,
  Button,
  Icon,
  RHFSelect,
  Checkbox,
  Label,
  RequestError,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Badge,
} from "@/components";
import { useModal } from "@/stores";
import { availableCashiers, Cashier } from "../data";
import { useGetStores } from "@/hooks/entities";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { PosOpeningFormData, posOpeningSchema } from "@/schemas/pos-opening";
import { useCurrentCashierStore } from "@/stores/pos/current-cashier-store";

export function PosOpeningModal() {
  const { closeModal } = useModal();
  const { currentCashier, setCurrentCashier } = useCurrentCashierStore();
  const { stores, isLoading: isLoadingStores, error, refetch } = useGetStores();
  const [codigo, setCodigo] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PosOpeningFormData>({
    resolver: zodResolver(posOpeningSchema),
    defaultValues: {
      initialCapital: "",
      workTime: "",
      storeId: "",
      cashierIds: [],
    },
  });

  const isEdit = !!currentCashier;

  useEffect(() => {
    if (isEdit && currentCashier) {
      reset({
        initialCapital: (currentCashier.totalSold || 0).toString(),
        workTime: currentCashier.activityTime || "",
        storeId: "", // Mock stores don't match cashier mock yet
        cashierIds: [currentCashier.id],
      });
    } else {
      reset({
        initialCapital: "",
        workTime: "",
        storeId: "",
        cashierIds: [],
      });
    }
  }, [isEdit, currentCashier, reset]);

  const selectedCashierIds = watch("cashierIds") || [];

  const handleClose = () => {
    reset();
    setCurrentCashier(null);
    closeModal("opening-cashier");
  };

  const onSubmit = (data: PosOpeningFormData) => {
    console.log("Abertura de Caixa:", data);
    // Simular salvamento
    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  if (isLoadingStores) {
    return (
      <GlobalModal id="opening-cashier" title="Abertura de Caixa" canClose>
        <div className="p-8 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Carregando lojas...
          </p>
        </div>
      </GlobalModal>
    );
  }

  if (error) {
    return (
      <GlobalModal id="opening-cashier" title="Abertura de Caixa" canClose>
        <div className="p-4">
          <RequestError
            refetch={refetch}
            message="Ocorreu um erro ao carregar as lojas"
          />
        </div>
      </GlobalModal>
    );
  }

  return (
    <GlobalModal
      id="opening-cashier"
      title={isEdit ? "Editar Configuração de Caixa" : "Abertura de Caixa"}
      description={
        isEdit
          ? "Edite as configurações da sessão deste caixa"
          : "Faça a abertura de caixa aqui e controle o fluxo de vendas dos seu funcionários"
      }
      canClose
      className="sm:max-w-[600px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ler código de barras"
              className="border p-2 w-full"
              autoFocus
            />
          </div>

          <div className="space-y-2 col-span-1">
            <Input
              label="Capital Inicial"
              placeholder="0"
              startIcon="CircleDollarSign"
              {...register("initialCapital")}
              error={errors.initialCapital?.message}
            />
          </div>
          <div className="space-y-2 col-span-1">
            <Input
              label="Tempo de Expediente"
              placeholder="HH:MM"
              startIcon="Clock"
              {...register("workTime")}
              error={errors.workTime?.message}
            />
          </div>

          <RHFSelect
            name="storeId"
            control={control}
            label="Loja"
            options={stores}
          />

          <div>
            <Label className="text-sm font-medium">
              {isEdit
                ? "Caixa sendo editado"
                : "Caixas Disponíveis para Abertura"}
            </Label>

            <Popover>
              <PopoverTrigger asChild disabled={isEdit}>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between px-4 font-normal hover:bg-muted transition-all text-muted-foreground border-muted-foreground/10",
                    selectedCashierIds.length > 0 &&
                      "text-foreground font-medium",
                    isEdit && "opacity-100 cursor-default"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="LayoutGrid" className="w-4 h-4 opacity-50" />
                    {isEdit ? (
                      <div className="flex items-center gap-2">
                        <span>{currentCashier?.name}</span>
                        <Badge variant="outline" className="text-[10px] py-0">
                          {currentCashier?.user}
                        </Badge>
                      </div>
                    ) : selectedCashierIds.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <span>
                          {selectedCashierIds.length} caixas selecionados
                        </span>
                      </div>
                    ) : (
                      <span>Escolha os caixas</span>
                    )}
                  </div>
                  {!isEdit && (
                    <Icon
                      name="ChevronDown"
                      className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <div className="space-y-1 max-h-[250px] overflow-y-auto">
                  <Controller
                    name="cashierIds"
                    control={control}
                    render={({ field }) => (
                      <>
                        {availableCashiers.map((cashier) => (
                          <div
                            key={cashier.id}
                            className={cn(
                              "flex items-center space-x-3 p-2.5 rounded-md transition-colors cursor-pointer hover:bg-muted/20",
                              field.value?.includes(cashier.id) &&
                                "bg-primary/5 border-primary/10"
                            )}
                            onClick={() => {
                              const current = field.value || [];
                              const newValue = current.includes(cashier.id)
                                ? current.filter((id) => id !== cashier.id)
                                : [...current, cashier.id];
                              field.onChange(newValue);
                            }}
                          >
                            <Checkbox
                              id={`cashier-${cashier.id}`}
                              checked={field.value?.includes(cashier.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                const newValue = checked
                                  ? [...current, cashier.id]
                                  : current.filter((id) => id !== cashier.id);
                                field.onChange(newValue);
                              }}
                            />
                            <div className="grid gap-0.5 leading-none">
                              <label className="text-sm truncate cursor-pointer">
                                {cashier.name}
                              </label>
                              <p className="text-[10px] text-green-500">
                                {cashier.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  />
                </div>
              </PopoverContent>
            </Popover>

            {errors.cashierIds && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">
                {errors.cashierIds.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-muted-foreground/5">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isEdit ? "Salvar Alterações" : "Abrir Caixa"}
          </Button>
        </div>
      </form>
    </GlobalModal>
  );
}
