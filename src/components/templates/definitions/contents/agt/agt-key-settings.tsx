"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  ButtonSubmit,
  Icon,
  Label,
  Separator,
  Textarea,
} from "@/components";
import { useAgtStatus, useUpdateAgtPrivateKey } from "@/hooks/agt";
import {
  agtPrivateKeySchema,
  type AgtPrivateKeyFormData,
} from "@/schemas/agt-schema";
import { ErrorMessage, getApiErrorMessage } from "@/utils";

export function AgtKeySettings() {
  const { data: status, isLoading: isFetchingStatus } = useAgtStatus();
  const { mutateAsync: updatePrivateKey, isPending } =
    useUpdateAgtPrivateKey();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgtPrivateKeyFormData>({
    resolver: zodResolver(agtPrivateKeySchema),
    defaultValues: { privateKey: "" },
  });

  async function onSubmit(data: AgtPrivateKeyFormData) {
    try {
      await updatePrivateKey(data.privateKey);
      reset({ privateKey: "" });
    } catch (error) {
      ErrorMessage(
        getApiErrorMessage(error, "Não foi possível actualizar a chave."),
      );
    }
  }

  const hasKey = status?.hasKey ?? null;

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Chave privada</h3>
          <p className="text-sm text-muted-foreground">
            Configure a chave PEM usada na assinatura digital da empresa.
          </p>
        </div>

        {isFetchingStatus ? (
          <Badge variant="outline">A verificar...</Badge>
        ) : hasKey ? (
          <Badge variant="secondary" className="gap-1.5">
            <Icon name="ShieldCheck" className="h-3.5 w-3.5" />
            Configurada
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1.5">
            <Icon name="ShieldAlert" className="h-3.5 w-3.5" />
            Não configurada
          </Badge>
        )}
      </div>

      <Alert>
        <Icon name="Info" />
        <AlertTitle>Segurança</AlertTitle>
        <AlertDescription>
          A chave privada é encriptada no servidor antes de ser armazenada. Por
          segurança, não é possível recuperá-la depois do envio.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="private-key">Conteúdo da chave</Label>
          <Textarea
            id="private-key"
            placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
            className="min-h-52 resize-none font-mono text-xs"
            {...register("privateKey")}
          />
          {errors.privateKey && (
            <p className="text-xs text-red-500">{errors.privateKey.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Cole o conteúdo completo do ficheiro PEM para substituir a chave
            actualmente configurada.
          </p>
        </div>

        <Separator />

        <div className="flex justify-end">
          <ButtonSubmit isLoading={isSubmitting || isPending} className="w-max">
            Actualizar chave
          </ButtonSubmit>
        </div>
      </form>
    </div>
  );
}
