"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, type ReactNode, useContext } from "react";
import type { api } from "@/convex/_generated/api";

type UserContextValue = {
  user: ReturnType<typeof usePreloadedQuery<typeof api.auth.getCurrentUser>>;
};

const UserContext = createContext<UserContextValue | null>(null);

type UserProviderProps = {
  children: ReactNode;
  preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
};

export function UserProvider({ children, preloadedUser }: UserProviderProps) {
  const user = usePreloadedQuery(preloadedUser);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  return context;
}
