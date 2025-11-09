"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, type ReactNode, useContext } from "react";
import type { api } from "@/convex/_generated/api";

type ModelsContextValue = {
  models: ReturnType<typeof usePreloadedQuery<typeof api.models.getAll>>;
};

const ModelsContext = createContext<ModelsContextValue | null>(null);

type ModelsProviderProps = {
  children: ReactNode;
  preloadedModels: Preloaded<typeof api.models.getAll>;
};

export function ModelsProvider({
  children,
  preloadedModels,
}: ModelsProviderProps) {
  const models = usePreloadedQuery(preloadedModels);

  return (
    <ModelsContext.Provider value={{ models }}>
      {children}
    </ModelsContext.Provider>
  );
}

export function useModelsContext() {
  const context = useContext(ModelsContext);
  return context;
}
