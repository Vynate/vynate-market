"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import PusherClient from "pusher-js";
import type { Channel, PresenceChannel } from "pusher-js";

let pusherInstance: PusherClient | null = null;

function getPusherClient(): PusherClient {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
      }
    );
  }
  return pusherInstance;
}

interface UsePusherOptions {
  channelName: string;
  eventName?: string;
  onEvent?: (data: unknown) => void;
  enabled?: boolean;
}

export function usePusher<T = unknown>({
  channelName,
  eventName,
  onEvent,
  enabled = true,
}: UsePusherOptions) {
  const channelRef = useRef<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const subscribe = useCallback(() => {
    if (!enabled) return;

    try {
      const pusher = getPusherClient();
      
      // Subscribe to channel
      const channel = pusher.subscribe(channelName);
      channelRef.current = channel;

      // Handle connection state
      channel.bind("pusher:subscription_succeeded", () => {
        setIsConnected(true);
        setError(null);
      });

      channel.bind("pusher:subscription_error", (err: Error) => {
        setError(err);
        setIsConnected(false);
      });

      // Bind to specific event if provided
      if (eventName && onEvent) {
        channel.bind(eventName, (data: T) => {
          onEvent(data);
        });
      }

      return channel;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  }, [channelName, eventName, onEvent, enabled]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      const pusher = getPusherClient();
      pusher.unsubscribe(channelName);
      channelRef.current = null;
      setIsConnected(false);
    }
  }, [channelName]);

  const trigger = useCallback(
    (event: string, data: unknown) => {
      if (channelRef.current && channelName.startsWith("private-")) {
        channelRef.current.trigger(`client-${event}`, data);
      }
    },
    [channelName]
  );

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  return {
    channel: channelRef.current,
    isConnected,
    error,
    trigger,
    subscribe,
    unsubscribe,
  };
}

// Hook for presence channels (typing indicators, online status)
interface UsePresenceOptions {
  channelName: string;
  userId: string;
  userInfo?: Record<string, unknown>;
  enabled?: boolean;
}

interface PresenceMember {
  id: string;
  info: Record<string, unknown>;
}

export function usePresenceChannel({
  channelName,
  userId,
  userInfo = {},
  enabled = true,
}: UsePresenceOptions) {
  const channelRef = useRef<PresenceChannel | null>(null);
  const [members, setMembers] = useState<PresenceMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !channelName.startsWith("presence-")) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    channel.bind("pusher:subscription_succeeded", (data: { members: Record<string, unknown> }) => {
      setIsConnected(true);
      const memberList: PresenceMember[] = [];
      Object.entries(data.members).forEach(([id, info]) => {
        memberList.push({ id, info: info as Record<string, unknown> });
      });
      setMembers(memberList);
    });

    channel.bind("pusher:member_added", (member: { id: string; info: Record<string, unknown> }) => {
      setMembers((prev) => [...prev, { id: member.id, info: member.info }]);
    });

    channel.bind("pusher:member_removed", (member: { id: string }) => {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    });

    return () => {
      pusher.unsubscribe(channelName);
      channelRef.current = null;
      setIsConnected(false);
      setMembers([]);
    };
  }, [channelName, userId, userInfo, enabled]);

  const triggerClientEvent = useCallback(
    (event: string, data: unknown) => {
      if (channelRef.current) {
        channelRef.current.trigger(`client-${event}`, data);
      }
    },
    []
  );

  return {
    channel: channelRef.current,
    members,
    isConnected,
    me: members.find((m) => m.id === userId),
    others: members.filter((m) => m.id !== userId),
    trigger: triggerClientEvent,
  };
}

// Hook for chat functionality
interface UseChatOptions {
  roomId: string;
  userId: string;
  userName: string;
  onMessage?: (message: ChatMessage) => void;
  enabled?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: string[];
  createdAt: Date;
}

export function useChat({
  roomId,
  userId,
  userName,
  onMessage,
  enabled = true,
}: UseChatOptions) {
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const { channel, isConnected, trigger } = usePusher({
    channelName: `presence-chat-${roomId}`,
    enabled,
  });

  // Listen for messages
  useEffect(() => {
    if (!channel || !onMessage) return;

    channel.bind("new-message", (message: ChatMessage) => {
      onMessage(message);
    });

    return () => {
      channel.unbind("new-message");
    };
  }, [channel, onMessage]);

  // Listen for typing indicators
  useEffect(() => {
    if (!channel) return;

    channel.bind("client-typing", (data: { userId: string; userName: string }) => {
      if (data.userId === userId) return;

      setIsTyping((prev) => {
        if (!prev.includes(data.userName)) {
          return [...prev, data.userName];
        }
        return prev;
      });

      // Clear existing timeout
      if (typingTimeoutRef.current[data.userId]) {
        clearTimeout(typingTimeoutRef.current[data.userId]);
      }

      // Set new timeout to remove typing indicator
      typingTimeoutRef.current[data.userId] = setTimeout(() => {
        setIsTyping((prev) => prev.filter((name) => name !== data.userName));
      }, 3000);
    });

    return () => {
      channel.unbind("client-typing");
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, [channel, userId]);

  const sendTyping = useCallback(() => {
    trigger("typing", { userId, userName });
  }, [trigger, userId, userName]);

  const sendMessage = useCallback(
    async (content: string, attachments?: string[]) => {
      // This would typically be an API call that then triggers Pusher server-side
      const response = await fetch(`/api/chat/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, attachments }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.json();
    },
    [roomId]
  );

  return {
    isConnected,
    isTyping,
    sendMessage,
    sendTyping,
  };
}
