import type { Doc } from "@/convex/_generated/dataModel";

export type UserSettings = Doc<"settings">;

export const defaultSettings: Omit<
  UserSettings,
  "_creationTime" | "_id" | "userId"
> = {
  mode: "dark",
  theme: "default",
  nickname: undefined,
  biography: undefined,
  instructions: undefined,
  modelId: "mistral-small-latest",
  pinnedModels: ["magistral-small-latest", "mistral-small-latest"],
};
