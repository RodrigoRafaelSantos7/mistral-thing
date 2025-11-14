"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, useContext } from "react";
import type { api } from "@/convex/_generated/api";
import type { ModelContextType } from "@/lib/model-store/utils";

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelsProvider({
  initialModels,
  children,
}: {
  initialModels: Preloaded<typeof api.models.list>;
  children: React.ReactNode;
}) {
  const models = usePreloadedQuery(initialModels);

  return (
    <ModelContext.Provider value={{ models: models ?? [] }}>
      {children}
    </ModelContext.Provider>
  );
}

/**
 * Custom hook to use the model context
 * @returns The model context
 */
export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelContext");
  }
  return context;
}
