"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, useContext } from "react";
import type { api } from "@/convex/_generated/api";
import type { UserContextType } from "@/lib/user-store/utils";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: Preloaded<typeof api.users.get>;
  children: React.ReactNode;
}) {
  const user = usePreloadedQuery(initialUser);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

/**
 * Custom hook to use the user context
 *
 * @returns The user context
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContext");
  }
  return context;
}
