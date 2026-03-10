import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationSettingsState {
  soundEnabled: boolean;
  soundType: string;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundType: (type: string) => void;
}

export const useNotificationSettingsStore = create<NotificationSettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true, // Auto-enabled by default as requested
      soundType: "/sound-effects/notification-2.mp3", // Default sound
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSoundType: (type) => set({ soundType: type }),
    }),
    {
      name: "notification-settings", // key in localStorage
    },
  ),
);
