"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, type ReactNode, useContext } from "react";
import type { api } from "@/convex/_generated/api";

type SettingsContextValue = {
  settings: ReturnType<typeof usePreloadedQuery<typeof api.settings.get>>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

type SettingsProviderProps = {
  children: ReactNode;
  preloadedSettings: Preloaded<typeof api.settings.get>;
};

export function SettingsProvider({
  children,
  preloadedSettings,
}: SettingsProviderProps) {
  const settings = usePreloadedQuery(preloadedSettings);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  return context;
}
