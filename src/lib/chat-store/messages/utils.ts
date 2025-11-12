import type { Id } from "@/convex/_generated/dataModel";

export type Message = {
  id: Id<"message">;
  chatId: Id<"chat">;
  content?: string;
  role: "system" | "user" | "assistant" | "tool";
  userId?: string;
  modelId: string;
};
