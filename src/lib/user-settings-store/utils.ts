export type ModeType = "dark" | "light";

export type ThemeType =
  | "default"
  | "t3-chat"
  | "claymorphism"
  | "claude"
  | "graphite"
  | "amethyst-haze"
  | "vercel";

export type UserSettingsType = {
  mode: ModeType;
  theme: ThemeType;
  nickname?: string;
  biography?: string;
  instructions?: string;
  modelId: string;
  pinnedModels: string[];
};

export const defaultSettings: UserSettingsType = {
  mode: "dark",
  theme: "default",
  nickname: undefined,
  biography: undefined,
  instructions: undefined,
  modelId: "mistral-small-latest",
  pinnedModels: ["magistral-small-latest", "mistral-small-latest"],
};
