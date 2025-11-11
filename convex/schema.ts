import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const themes = v.union(
  v.literal("default"),
  v.literal("t3-chat"),
  v.literal("claymorphism"),
  v.literal("claude"),
  v.literal("graphite"),
  v.literal("amethyst-haze"),
  v.literal("vercel")
);

export const modes = v.union(v.literal("light"), v.literal("dark"));

export const threadStatus = v.union(
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
    modelId: v.string(),
    pinnedModels: v.array(v.string()),
  }).index("by_userId", ["userId"]),
  model: defineTable({
    modelId: v.string(),
    name: v.union(v.string(), v.null()),
    description: v.union(v.string(), v.null()),
    capabilities: v.object({
      completionChat: v.optional(v.boolean()),
      completionFim: v.optional(v.boolean()),
      functionCalling: v.optional(v.boolean()),
      fineTuning: v.optional(v.boolean()),
      vision: v.optional(v.boolean()),
      classification: v.optional(v.boolean()),
    }),
  }).index("by_modelId", ["modelId"]),
});
export default schema;
