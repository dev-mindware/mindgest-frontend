"use client";
import { useNotificationSettingsStore } from "@/stores/notifications";
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

export function Notification() {
  const { soundEnabled, soundType, setSoundEnabled, setSoundType } =
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
            control={<Switch />}
          />

          <Separator />

          <SettingRow
            label="Ativar selo de notificação não lida"
            description="Apresentar um emblema no ícone de notificação quando tem mensagens não lidas"
            control={<Switch />}
          />

          <Separator />

          <SettingRow
            label="Desativar Notificações durante:"
            control={
              <Select defaultValue="10 minutos">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Escolha o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10 minutos">10 minutos</SelectItem>
                  <SelectItem value="30 minutos">30 minutos</SelectItem>
                  <SelectItem value="1 hora">1 hora</SelectItem>
                  <SelectItem value="4 horas">4 horas</SelectItem>
                </SelectContent>
              </Select>
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

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Sons</h2>
          <p className="text-sm text-muted-foreground">
            Personalize o som das notificações MindGest.
          </p>
        </div>
        <Separator />

        <div className="space-y-6 md:p-8">
          <SettingRow
            label="Ativar som nas notificações"
            control={
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            }
          />

          <Separator />

          <SettingRow
            label="Som padrão"
            control={
              <Select value={soundType} onValueChange={setSoundType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Escolha o som" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="/sound-effects/notification-1.mp3">
                    Paradise
                  </SelectItem>
                  <SelectItem value="/sound-effects/notification-2.mp3">
                    Ding
                  </SelectItem>
                  <SelectItem value="/sound-effects/notification-3.mp3">
                    Beep
                  </SelectItem>
                  <SelectItem value="/sound-effects/notification-error.mp3">
                    Alert
                  </SelectItem>
                </SelectContent>
              </Select>
            }
          />

          <Separator />
        </div>
      </section>
    </div>
  );
}

// Componente reutilizável para linha de configuração
function SettingRow({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
