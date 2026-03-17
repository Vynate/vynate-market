import Pusher from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher instance
let pusherServer: Pusher | null = null;

export function getPusherServer() {
  if (!pusherServer) {
    pusherServer = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return pusherServer;
}

// Client-side Pusher instance (singleton)
let pusherClient: PusherClient | null = null;

export function getPusherClient() {
  if (typeof window === "undefined") {
    throw new Error("getPusherClient can only be called on the client side");
  }

  if (!pusherClient) {
    pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });
  }

  return pusherClient;
}

// Channel names
export const channels = {
  user: (userId: string) => `private-user-${userId}`,
  vendor: (vendorId: string) => `private-vendor-${vendorId}`,
  admin: "private-admin",
  chat: (roomId: string) => `presence-chat-${roomId}`,
  orders: "private-orders",
};

// Event names
export const events = {
  // Chat events
  NEW_MESSAGE: "new-message",
  MESSAGE_READ: "message-read",
  USER_TYPING: "user-typing",
  USER_ONLINE: "user-online",

  // Order events
  NEW_ORDER: "new-order",
  ORDER_STATUS_UPDATE: "order-status-update",

  // Notification events
  NEW_NOTIFICATION: "new-notification",

  // Vendor events
  NEW_VENDOR_APPLICATION: "new-vendor-application",
  VENDOR_APPROVED: "vendor-approved",
  VENDOR_REJECTED: "vendor-rejected",

  // Live feed events
  LIVE_ORDER_FEED: "live-order-feed",
};

/**
 * Trigger an event on a channel (server-side)
 */
export async function triggerEvent<T>(
  channel: string,
  event: string,
  data: T
) {
  const pusher = getPusherServer();
  await pusher.trigger(channel, event, data);
}

/**
 * Trigger events on multiple channels
 */
export async function triggerBatch(
  events: Array<{
    channel: string;
    name: string;
    data: unknown;
  }>
) {
  const pusher = getPusherServer();
  await pusher.triggerBatch(events);
}

/**
 * Send notification to a user
 */
export async function sendUserNotification(
  userId: string,
  notification: {
    title: string;
    body: string;
    type: string;
    link?: string;
  }
) {
  await triggerEvent(channels.user(userId), events.NEW_NOTIFICATION, notification);
}

/**
 * Send notification to a vendor
 */
export async function sendVendorNotification(
  vendorId: string,
  notification: {
    title: string;
    body: string;
    type: string;
    link?: string;
  }
) {
  await triggerEvent(channels.vendor(vendorId), events.NEW_NOTIFICATION, notification);
}

/**
 * Broadcast to admin channel
 */
export async function broadcastToAdmin<T>(event: string, data: T) {
  await triggerEvent(channels.admin, event, data);
}

/**
 * Send chat message
 */
export async function sendChatMessage(
  roomId: string,
  message: {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    attachments?: string[];
    createdAt: Date;
  }
) {
  await triggerEvent(channels.chat(roomId), events.NEW_MESSAGE, message);
}

/**
 * Authenticate a channel subscription (for private/presence channels)
 */
export function authenticateChannel(
  socketId: string,
  channel: string,
  userData?: {
    user_id: string;
    user_info?: Record<string, unknown>;
  }
) {
  const pusher = getPusherServer();

  if (channel.startsWith("presence-") && userData) {
    return pusher.authorizeChannel(socketId, channel, userData);
  }

  return pusher.authorizeChannel(socketId, channel);
}
