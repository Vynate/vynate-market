"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useNotificationStore, type Notification } from "@/store/notification.store";
import { usePusher } from "./use-pusher";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useNotifications() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const store = useNotificationStore();

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", store.page],
    queryFn: async () => {
      const response = await fetch(
        `/api/notifications?page=${store.page}&limit=20`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json() as Promise<{
        notifications: Notification[];
        hasMore: boolean;
        unreadCount: number;
      }>;
    },
    enabled: !!session,
  });

  // Update store when data changes
  useEffect(() => {
    if (data) {
      if (store.page === 1) {
        store.setNotifications(data.notifications);
      } else {
        store.setNotifications([...store.notifications, ...data.notifications]);
      }
    }
  }, [data]);

  // Real-time notifications via Pusher
  usePusher({
    channelName: session?.user?.id ? `private-user-${session.user.id}` : "",
    eventName: "new-notification",
    onEvent: (notification) => {
      store.addNotification(notification as Notification);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    enabled: !!session?.user?.id,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: (_, id) => {
      store.markAsRead(id);
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to mark all as read");
      return response.json();
    },
    onSuccess: () => {
      store.markAllAsRead();
    },
  });

  const markAsRead = useCallback(
    (id: string) => {
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation]
  );

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const loadMore = useCallback(() => {
    if (data?.hasMore) {
      store.loadMore();
    }
  }, [data?.hasMore]);

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    isLoading: isLoading || store.isLoading,
    hasMore: data?.hasMore ?? false,
    markAsRead,
    markAllAsRead,
    loadMore,
    refresh: () => {
      store.reset();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  };
}
