"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Label,
  Switch,
} from "@/components";
import { cn } from "@/lib/utils";
import { useNotificationSettingsStore } from "@/stores/notifications/notification-settings-store";

export function Notification() {
  const { pushEnabled, badgeEnabled, setPushEnabled, setBadgeEnabled } =
    useNotificationSettingsStore();

  return (
    <div>
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Notificações</h2>
          <p className="text-sm text-muted-foreground">
            Personalize a forma como recebe notificações no MindGest.
          </p>
        </div>
        <Separator />

        <div className="space-y-6 md:p-8">
          <SettingRow
            label="Ativar notificações"
            description="Receber notificações de todas as mensagens, faturas, documentos..."
            control={
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            }
          />

          <Separator />

          <SettingRow
            label="Ativar selo de notificação não lida"
            description="Apresentar um emblema no ícone de notificação quando tem mensagens não lidas"
            disabled={!pushEnabled}
            control={
              <Switch
                checked={badgeEnabled}
                onCheckedChange={setBadgeEnabled}
                disabled={!pushEnabled}
              />
            }
          />

          <Separator />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Alertas no Email</h2>
          <p className="text-sm text-muted-foreground">
            Personalize a forma como recebe mensagens no seu email.
          </p>
        </div>
        <Separator />

        <div className="space-y-6 md:p-8">
          <SettingRow
            label="E-mails de comunicação"
            description="Recebe mensagens de alertas simples, receitas, despesas e irregularidades"
            control={<Switch />}
          />

          <Separator />

          <SettingRow
            label="Anúncios & Upgrades"
            description="Recebe anúncios de produtos novos, melhorias no software, etc"
            control={<Switch />}
          />

          <Separator />
        </div>
      </section>
    </div>
  );
}

function SettingRow({
  label,
  description,
  control,
  disabled,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between transition-opacity",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      <div className="max-w-md">
        <Label className="block">{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="mt-2 sm:mt-0">{control}</div>
    </div>
  );
}
