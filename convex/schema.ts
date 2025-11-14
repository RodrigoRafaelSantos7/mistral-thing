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

export default defineSchema({
  settings: defineTable({
    userId: v.string(),
    mode: modes,
    theme: themes,
    nickname: v.optional(v.string()),
    biography: v.optional(v.string()),
    instructions: v.optional(v.string()),
    modelId: v.string(), // The current model selected by the user
    pinnedModels: v.array(v.string()), // The models pinned by the user
  }).index("by_userId", ["userId"]),
  model: defineTable({
    modelId: v.string(),
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
  thread: defineTable({
    userId: v.string(),
    slug: v.string(),
    title: v.optional(v.string()),
    status: v.union(
      v.literal("ready"),
      v.literal("streaming"),
      v.literal("submitted")
    ),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_slug", ["slug"]),
  messages: defineTable({
    threadId: v.id("thread"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    streamId: v.optional(v.string()),
    isStreaming: v.optional(v.boolean()),
    streamingComplete: v.optional(v.boolean()),
  }).index("by_thread", ["threadId"]),
});
