export const THEMES = [
  {
    name: "Default",
    value: "default",
    description: "Clean and minimal design",
  },
  {
    name: "T3 Chat",
    value: "t3-chat",
    description: "Modern chat interface style",
  },
  {
    name: "Claymorphism",
    value: "claymorphism",
    description: "Soft, clay-like appearance",
  },
  {
    name: "Claude",
    value: "claude",
    description: "Anthropic's Claude-inspired theme",
  },
  {
    name: "Graphite",
    value: "graphite",
    description: "Dark and sophisticated",
  },
  {
    name: "Amethyst Haze",
    value: "amethyst-haze",
    description: "Purple and pink theme",
  },
  {
    name: "Vercel",
    value: "vercel",
    description: "Vercel-inspired theme",
  },
] as const;

export const DEFAULT_THEME = "default";
export const DEFAULT_MODE = "dark";
export const STORAGE_KEY = "mistral-thing-theme";

export const THEME_OPTIONS = [
  "default-light",
  "default-dark",
  "t3-chat-light",
  "t3-chat-dark",
  "claymorphism-light",
  "claymorphism-dark",
  "claude-light",
  "claude-dark",
  "graphite-light",
  "graphite-dark",
  "amethyst-haze-light",
  "amethyst-haze-dark",
  "vercel-light",
  "vercel-dark",
];
