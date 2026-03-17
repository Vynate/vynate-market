"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

const PING_INTERVAL = 4 * 60 * 1000; // 4 minutes
const VISIBILITY_CHECK_INTERVAL = 30 * 1000; // 30 seconds

export function useSessionKeepalive() {
  const { data: session, update } = useSession();
  const lastPingRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pingSession = useCallback(async () => {
    if (!session) return;

    try {
      // Fetch session to keep it alive
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        lastPingRef.current = Date.now();
      } else {
        console.warn("Session ping failed:", response.status);
      }
    } catch (error) {
      console.error("Session ping error:", error);
    }
  }, [session]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      const timeSinceLastPing = Date.now() - lastPingRef.current;
      
      // If more than 5 minutes since last ping, refresh session
      if (timeSinceLastPing > 5 * 60 * 1000) {
        pingSession();
        // Also trigger session update
        update();
      }
    }
  }, [pingSession, update]);

  const handleFocus = useCallback(() => {
    const timeSinceLastPing = Date.now() - lastPingRef.current;
    
    // If more than 3 minutes since last ping, refresh
    if (timeSinceLastPing > 3 * 60 * 1000) {
      pingSession();
    }
  }, [pingSession]);

  useEffect(() => {
    if (!session) return;

    // Set up interval for regular pings
    intervalRef.current = setInterval(pingSession, PING_INTERVAL);

    // Set up visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Set up focus listener
    window.addEventListener("focus", handleFocus);

    // Initial ping
    pingSession();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [session, pingSession, handleVisibilityChange, handleFocus]);

  return {
    lastPing: lastPingRef.current,
    pingNow: pingSession,
  };
}
