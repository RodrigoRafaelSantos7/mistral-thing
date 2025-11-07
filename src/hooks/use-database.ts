import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

const defaultSettings: Doc<"settings"> = {
  _id: crypto.randomUUID() as Id<"settings">,
  _creationTime: Date.now(),
  userId: crypto.randomUUID(),
  mode: "dark" as const,
  theme: "default" as const,
  modelId: "mistral-small-latest" as const,
  pinnedModels: [
    "mistral-medium-latest" as const,
    "codestral-latest" as const,
    "mistral-small-latest" as const,
  ],
};

export function useSettings() {
  const settings = useQuery(api.settings.get, {});

  const createSettings = useMutation(api.settings.create).withOptimisticUpdate(
    (localStore, _args) => {
      const currentSettings = localStore.getQuery(api.settings.get, {});
      if (currentSettings !== undefined && currentSettings !== null) {
        return;
      }
      localStore.setQuery(api.settings.get, {}, defaultSettings);
    }
  );

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

  return {
    createSettings,
    updateSettings,
    settings,
  };
}

export function useUser() {
  const user = useQuery(api.auth.getCurrentUser);
  return user;
}
