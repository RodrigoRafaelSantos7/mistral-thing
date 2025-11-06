import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type SessionItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export function useListSessions(): SessionItem[] {
  const [activeSessions, setActiveSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    (async () => {
      const result = await authClient.listSessions();
      if (Array.isArray(result)) {
        setActiveSessions(result);
      }
    })().catch(() => {
      // Failed to load sessions
    });
  }, []);

  return activeSessions;
}
