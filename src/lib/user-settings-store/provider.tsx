"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import type { UserSettingsType } from "./utils";
import { defaultSettings } from "./utils";

type UserSettingsContextType = {
  settings: UserSettingsType;
  updateSettings: (args: Partial<UserSettingsType>) => void;
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

/**
 * Provider component for the user settings context.
 *
 * @param children - The child components to wrap
 * @param initialSettings - The initial settings to use
 *   if not provided, the default settings will be used
 * @returns The user settings context provider
 */
export function UserSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: Preloaded<typeof api.settings.get>;
}) {
  const settingsQueryResult = usePreloadedQuery(initialSettings);
  const settings = settingsQueryResult ?? defaultSettings;

  const updateSettings = useMutation(api.settings.update).withOptimisticUpdate(
    (localStore, args) => {
      const currentSettings = localStore.getQuery(api.settings.get, {});
      if (currentSettings !== undefined && currentSettings !== null) {
        const updatedSettings = {
          ...currentSettings,
          ...(args.mode !== undefined && { mode: args.mode }),
          ...(args.theme !== undefined && { theme: args.theme }),
          ...(args.modelId !== undefined && { modelId: args.modelId }),
          ...(args.pinnedModels !== undefined && {
            pinnedModels: args.pinnedModels,
          }),
          ...(args.nickname !== undefined && { nickname: args.nickname }),
          ...(args.biography !== undefined && { biography: args.biography }),
          ...(args.instructions !== undefined && {
            instructions: args.instructions,
          }),
        };
        localStore.setQuery(api.settings.get, {}, updatedSettings);
      }
    }
  );

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

/**
 * Custom hook to access the user settings context.
 *
 * @throws {Error} If the component is not wrapped in a UserSettingsProvider
 * @returns The user settings context
 */
export function useUserSettings() {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error("useUserSettings must be used within UserSettingsProvider");
  }

  return context;
}
