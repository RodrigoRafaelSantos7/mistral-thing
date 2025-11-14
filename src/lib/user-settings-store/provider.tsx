"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import type { UserSettings } from "./utils";
import { defaultSettings } from "./utils";

type UserSettingsContextType = {
  /**
   * The Settings for the current user
   */
  settings: UserSettings;
  /**
   * Update the settings for the current user with optimistic updates
   *
   * @param args - The partial settings to update
   */
  updateSettings: (args: Partial<UserSettings>) => void;
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
  /**
   * The settings query result from the convex database that was preloaded on the server
   */
  const settingsQueryResult = usePreloadedQuery(initialSettings);

  /**
   * This is for fallback if the settings are not found in the database
   */
  const settings = settingsQueryResult ?? defaultSettings;

  /**
   * Update the settings for the current user with optimistic updates
   * using the convex update mutation. Updates the result from the preloaded
   * query result `settingsQueryResult` with the new settings.
   *
   * @param args - The partial settings to update
   */
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
