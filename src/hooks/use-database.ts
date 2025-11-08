import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSettings() {
  const settings = useQuery(api.settings.get, {});
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
    updateSettings,
    settings,
  };
}

export function useUser() {
  return useQuery(api.auth.getCurrentUser);
}
