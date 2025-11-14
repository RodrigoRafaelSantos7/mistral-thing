import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  settings: defineTable({
    userId: v.string(),
    theme: v.union(
      v.literal("default"),
      v.literal("t3-chat"),
      v.literal("claymorphism"),
      v.literal("claude"),
      v.literal("graphite"),
      v.literal("amethyst-haze"),
      v.literal("vercel")
    ),
    mode: v.union(v.literal("light"), v.literal("dark")),
    nickname: v.optional(v.string()),
    biography: v.optional(v.string()),
    instructions: v.optional(v.string()),
    modelId: v.string(), // The current model selected by the user
    pinnedModels: v.array(v.string()), // The models pinned by the user
  }).index("by_userId", ["userId"]),
  model: defineTable({
    modelId: v.string(), // Mistrals Model ID
    name: v.string(),
    description: v.string(),
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
