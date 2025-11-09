import { useMutation, useQuery } from "convex/react";
import { useModelsContext } from "@/components/providers/models-provider";
import { useSessionsContext } from "@/components/providers/sessions-provider";
import { useSettingsContext } from "@/components/providers/settings-provider";
import { useUserContext } from "@/components/providers/user-provider";
import { api } from "@/convex/_generated/api";

export function useSettings() {
  const context = useSettingsContext();
  const settingsFromQuery = useQuery(api.settings.get, {});
  const settings = context?.settings ?? settingsFromQuery;

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

export function useModels() {
  const context = useModelsContext();
  const modelsFromQuery = useQuery(api.models.getAll, {});
  const models = context?.models ?? modelsFromQuery;

  return models;
}

export function useSessions() {
  const context = useSessionsContext();
  const sessionsFromQuery = useQuery(api.users.getAllSessions, {});
  const sessions = context?.sessions ?? sessionsFromQuery;

  return sessions;
}

export function useUser() {
  const context = useUserContext();
  const userFromQuery = useQuery(api.auth.getCurrentUser);
  const user = context?.user ?? userFromQuery;

  return user;
}
