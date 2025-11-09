"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, type ReactNode, useContext } from "react";
import type { api } from "@/convex/_generated/api";

type SessionsContextValue = {
  sessions: ReturnType<
    typeof usePreloadedQuery<typeof api.users.getAllSessions>
  >;
};

const SessionsContext = createContext<SessionsContextValue | null>(null);

type SessionsProviderProps = {
  children: ReactNode;
  preloadedSessions: Preloaded<typeof api.users.getAllSessions>;
};

export function SessionsProvider({
  children,
  preloadedSessions,
}: SessionsProviderProps) {
  const sessions = usePreloadedQuery(preloadedSessions);

  return (
    <SessionsContext.Provider value={{ sessions }}>
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessionsContext() {
  const context = useContext(SessionsContext);
  return context;
}
