import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "ORDER" | "PAYMENT" | "REFUND" | "REVIEW" | "SYSTEM" | "CHAT" | "VENDOR" | "MARKETING";
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  page: number;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  loadMore: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      hasMore: true,
      page: 1,

      setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        set({ notifications, unreadCount });
      },

      addNotification: (notification) => {
        const { notifications } = get();
        // Add to beginning of list
        const updated = [notification, ...notifications];
        const unreadCount = updated.filter((n) => !n.isRead).length;
        set({ notifications: updated, unreadCount });
      },

      markAsRead: (id) => {
        const { notifications } = get();
        const updated = notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        const unreadCount = updated.filter((n) => !n.isRead).length;
        set({ notifications: updated, unreadCount });
      },

      markAllAsRead: () => {
        const { notifications } = get();
        const updated = notifications.map((n) => ({ ...n, isRead: true }));
        set({ notifications: updated, unreadCount: 0 });
      },

      removeNotification: (id) => {
        const { notifications } = get();
        const removed = notifications.find((n) => n.id === id);
        const updated = notifications.filter((n) => n.id !== id);
        const unreadCount = removed?.isRead
          ? get().unreadCount
          : get().unreadCount - 1;
        set({ notifications: updated, unreadCount: Math.max(0, unreadCount) });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      loadMore: () => {
        const { page, hasMore } = get();
        if (!hasMore) return;
        set({ page: page + 1 });
      },

      reset: () => {
        set({
          notifications: [],
          unreadCount: 0,
          isLoading: false,
          hasMore: true,
          page: 1,
        });
      },
    }),
    {
      name: "vynate-notifications",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50), // Only persist last 50
      }),
    }
  )
);

// Selectors
export const useNotifications = () =>
  useNotificationStore((state) => state.notifications);
export const useUnreadCount = () =>
  useNotificationStore((state) => state.unreadCount);
export const useNotificationLoading = () =>
  useNotificationStore((state) => state.isLoading);
