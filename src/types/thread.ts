import type { Id } from "@/convex/_generated/dataModel";

export type Message = {
  _id: Id<"message">;
  threadId: Id<"thread">;
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  updatedAt: number;
  streamId?: string;
};

export type Thread = {
  _id: Id<"thread">;
  title?: string;
  userId: string;
  messages: Message[];
  status: "ready" | "streaming" | "submitted";
  updatedAt: number;
};
