import { useMutation, useQuery } from "convex/react";
import { useContext } from "react";
import { DatabaseContext } from "@/context/database";
import { api } from "@/convex/_generated/api";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "useSettings" });

export function useDatabase() {
  const database = useContext(DatabaseContext);

  if (!database) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }

  return database;
}

export function useSettings() {
  const settings = useQuery(api.settings.get);
  const createSettings = useMutation(api.settings.create);
  const updateSettings = useMutation(api.settings.update);

  if (!settings) {
    createSettings().catch((error) => log.error(error));
  }

  return {
    updateSettings,
    settings,
  };
}
