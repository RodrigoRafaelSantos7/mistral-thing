"use client";

import { useQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import type { ModelContextType } from "@/lib/model-store/utils";

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelsProvider({ children }: { children: React.ReactNode }) {
  const models = useQuery(api.models.list) ?? [];
  const isLoading = models === undefined;

  return (
    <ModelContext.Provider value={{ models, isLoading }}>
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
