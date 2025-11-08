import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Session = NonNullable<
  Awaited<ReturnType<typeof authClient.listSessions>>["data"]
>[number];

export function useListSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const { data: sessionsData } = await authClient.listSessions();
        setSessions(sessionsData ?? []);
      } catch {
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { sessions, isLoading };
}
