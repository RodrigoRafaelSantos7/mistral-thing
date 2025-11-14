"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, useContext } from "react";
import type { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

// The type of a model document in the database.
export type ModelType = Doc<"model">;

type ModelsContextType = {
  /**
   * The models in the database.
   */
  models: ModelType[];
};

const ModelsContext = createContext<ModelsContextType | undefined>(undefined);

/**
 * Provider for the models context.
 *
 * @param initialModels - The initial models, preloaded from the database.
 * @param children - The children to render
 */
export function ModelsProvider({
  initialModels,
  children,
}: {
  initialModels: Preloaded<typeof api.models.list>;
  children: React.ReactNode;
}) {
  const models = usePreloadedQuery(initialModels);

  return (
    <ModelsContext.Provider value={{ models }}>
      {children}
    </ModelsContext.Provider>
  );
}

/**
 * Custom hook to access the models context.
 *
 * @throws {Error} If the component is not wrapped in a ModelsProvider
 * @returns The models context
 */
export function useModels() {
  const context = useContext(ModelsContext);

  if (!context) {
    throw new Error("useModels must be used within a ModelsProvider");
  }

  return context;
}
