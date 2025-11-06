import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const models = v.union(
  // Open Mistral Models
  v.literal("mistral-small-latest"),
  v.literal("devstral-small-2507"),
  v.literal("voxtral-small-latest"),
  v.literal("voxtral-mini-latest"),
  v.literal("pixtral-large-latest"),
  v.literal("pixtral-12b"),
  v.literal("open-mistral-nemo"),
  v.literal("open-mistral-7b"),
  v.literal("open-mixtral-8x7b"),
  v.literal("open-mixtral-8x22b"),
  v.literal("ministral-8b-latest"),
  v.literal("ministral-3b-latest"),

  // Premier Models
  v.literal("mistral-medium-latest"),
  v.literal("magistral-medium-latest"),
  v.literal("devstral-medium-2507"),
  v.literal("codestral-latest"),
  v.literal("mistral-ocr-latest"),
  v.literal("voxtral-mini-latest"),
  v.literal("magistral-small-latest"),
  v.literal("mistral-moderation-latest"),
  v.literal("codestral-embed-2505"),
  v.literal("mistral-embed"),
  v.literal("mistral-large-latest")
);

export const themes = v.union(
  v.literal("default"),
  v.literal("t3-chat"),
  v.literal("claymorphism"),
  v.literal("claude"),
  v.literal("graphite"),
  v.literal("amethyst-haze"),
  v.literal("vercel")
);

const capabilities = v.union(
  v.literal("reasoning"),
  v.literal("tools"),
  v.literal("vision"),
  v.literal("documents")
);

const accesses = v.union(
  v.literal("public"),
  v.literal("account-required"),
  v.literal("premium-required")
);

const icons = v.union(
  v.literal("codestral-embed"),
  v.literal("codestral"),
  v.literal("devstral"),
  v.literal("embed"),
  v.literal("large"),
  v.literal("magistral"),
  v.literal("medium"),
  v.literal("ministral"),
  v.literal("nemo"),
  v.literal("ocr"),
  v.literal("pixtral"),
  v.literal("small"),
  v.literal("voxtral")
);

const schema = defineSchema({
  settings: defineTable({
    userId: v.string(),
    mode: v.union(v.literal("light"), v.literal("dark")),
    theme: themes,
    nickname: v.optional(v.string()),
    biography: v.optional(v.string()),
    instructions: v.optional(v.string()),
    modelId: models,
    pinnedModels: v.array(models),
  }).index("by_userId", ["userId"]),
  model: defineTable({
    name: v.string(),
    model: models,
    description: v.string(),
    capabilities: v.array(capabilities),
    icon: icons,
    access: accesses,
    credits: v.number(),
  }),
});

export default schema;
