import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationSettingsState {
  soundEnabled: boolean;
  soundType: string;
  pushEnabled: boolean;
  badgeEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundType: (type: string) => void;
  setPushEnabled: (enabled: boolean) => void;
  setBadgeEnabled: (enabled: boolean) => void;
}

export const useNotificationSettingsStore = create<NotificationSettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      soundType: "/notification-1.mp3",
      pushEnabled: true,
      badgeEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSoundType: (type) => set({ soundType: type }),
      setPushEnabled: (enabled) => set({ pushEnabled: enabled }),
      setBadgeEnabled: (enabled) => set({ badgeEnabled: enabled }),
    }),
    {
      name: "notification-settings",
    },
  ),
);
