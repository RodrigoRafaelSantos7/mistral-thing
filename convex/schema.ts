import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const models = v.union(
  v.literal("mistral-medium-latest"),
  v.literal("mistral-small-latest"),
  v.literal("codestral-latest"),
  v.literal("magistral-medium-latest"),
  v.literal("magistral-small-latest")
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
  v.literal("text-input"),
  v.literal("text-output"),
  v.literal("image-input"),
  v.literal("image-output"),
  v.literal("reasoning-output")
);

const icons = v.union(
  v.literal("codestral"),
  v.literal("magistral"),
  v.literal("medium"),
  v.literal("small")
);

export const modes = v.union(v.literal("light"), v.literal("dark"));

export const status = v.union(
  v.literal("ready"),
  v.literal("streaming"),
  v.literal("submitted")
);

const schema = defineSchema({
  settings: defineTable({
    userId: v.string(),
    mode: modes,
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
    credits: v.number(),
  }).index("by_model", ["model"]),
  thread: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    status: v.optional(status),
    streamId: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_userId_updatedAt", ["userId", "updatedAt"]),
});

export default schema;
