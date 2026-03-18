"use client";

import * as React from "react";
import { useSessionKeepalive } from "@/hooks/use-session-keepalive";

interface KeepAliveProviderProps {
  children: React.ReactNode;
}

export function KeepAliveProvider({ children }: KeepAliveProviderProps) {
  // This hook handles session keepalive logic
  useSessionKeepalive();
  
  return <>{children}</>;
}
