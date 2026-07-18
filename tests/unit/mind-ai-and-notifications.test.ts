import {
  countWeeklyUserMessages,
  getCurrentWeekStart,
  MIND_WEEKLY_MESSAGE_LIMIT,
} from "@/constants/mind-ai";
import { notificationAlertState } from "@/hooks/notifications/notification-alert-state";

describe("mind ai weekly limit", () => {
  it("define um limite semanal único de 10 mensagens", () => {
    expect(MIND_WEEKLY_MESSAGE_LIMIT).toBe(10);
  });

  it("conta apenas mensagens do utilizador da semana corrente", () => {
    const weekStart = getCurrentWeekStart();
    const previousWeek = new Date(weekStart);
    previousWeek.setDate(previousWeek.getDate() - 1);

    const total = countWeeklyUserMessages([
      {
        messages: [
          { role: "user", created_at: weekStart.toISOString() },
          { role: "assistant", created_at: weekStart.toISOString() },
          { role: "user", created_at: previousWeek.toISOString() },
        ],
      },
    ]);

    expect(total).toBe(1);
  });

  it("não conta mensagens do utilizador que falharam (sem resposta da IA)", () => {
    const weekStart = getCurrentWeekStart();

    const total = countWeeklyUserMessages([
      {
        messages: [
          { role: "user", created_at: weekStart.toISOString() },
          { role: "assistant", created_at: weekStart.toISOString() },
          {
            role: "user",
            created_at: weekStart.toISOString(),
            failed: true,
          },
          {
            role: "assistant",
            created_at: weekStart.toISOString(),
            failed: true,
          },
        ],
      },
    ]);

    expect(total).toBe(1);
  });
});

describe("notification alert state", () => {
  beforeEach(() => {
    notificationAlertState.resetForTests();
  });

  it("não alerta antes de estabelecer a linha base", () => {
    expect(notificationAlertState.shouldAlert("notification-1")).toBe(false);
  });

  it("não alerta notificações já existentes na linha base", () => {
    notificationAlertState.establishBaseline(["notification-1"]);

    expect(notificationAlertState.shouldAlert("notification-1")).toBe(false);
  });

  it("alerta apenas uma vez por nova notificação", () => {
    notificationAlertState.establishBaseline(["notification-1"]);

    expect(notificationAlertState.shouldAlert("notification-2")).toBe(true);
    expect(notificationAlertState.shouldAlert("notification-2")).toBe(false);
  });
});
