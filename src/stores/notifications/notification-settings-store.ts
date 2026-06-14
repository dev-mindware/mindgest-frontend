import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationSettingsState {
  soundEnabled: boolean;
  soundType: string;
  browserNotificationsEnabled: boolean;
  badgeEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundType: (type: string) => void;
  setBrowserNotificationsEnabled: (enabled: boolean) => void;
  setBadgeEnabled: (enabled: boolean) => void;
}

export const useNotificationSettingsStore = create<NotificationSettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      soundType: "/sound-effects/notification-1.mp3",
      browserNotificationsEnabled: false,
      badgeEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSoundType: (type) => set({ soundType: type }),
      setBrowserNotificationsEnabled: (enabled) =>
        set({ browserNotificationsEnabled: enabled }),
      setBadgeEnabled: (enabled) => set({ badgeEnabled: enabled }),
    }),
    {
      name: "notification-settings",
      version: 2,
      migrate: (persistedState: any) => ({
        soundEnabled: persistedState?.soundEnabled ?? true,
        soundType:
          persistedState?.soundType === "/notification-1.mp3"
            ? "/sound-effects/notification-1.mp3"
            : persistedState?.soundType ?? "/sound-effects/notification-1.mp3",
        browserNotificationsEnabled: false,
        badgeEnabled: persistedState?.badgeEnabled ?? true,
      }),
    },
  ),
);
