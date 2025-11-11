import type { ReasoningUIPart, UIMessage, UIMessagePart } from "ai";

export const Capabilities = {
  REASONING: "reasoning",
  TOOLS: "tools",
  VISION: "vision",
  DOCUMENTS: "documents",
} as const;

export type Capability = (typeof Capabilities)[keyof typeof Capabilities];

export type Metadata = {
  model?: {
    id: string;
    name: string;
    icon: string;
  };
};

export type ReasoningTimePart = {
  id: string;
  type: "start" | "end";
  timestamp: number;
};

export type DataParts = {
  error: string;
  "research-start": {
    toolCallId: string;
    thoughts: string;
  };
  "research-search": {
    toolCallId: string;
    thoughts: string;
    query: string;
  };
  "research-read": {
    toolCallId: string;
    thoughts: string;
    url: string;
  };
  "research-complete": {
    toolCallId: string;
  };
  "reasoning-time": ReasoningTimePart;
};

export type ThreadMessage = UIMessage<Metadata, DataParts>;

export type MessagePart = UIMessagePart<DataParts, never>;

export type CustomReasoningUIPart = ReasoningUIPart & {
  startTime: number | null;
  endTime: number | null;
};

export type TransformedMessagePart =
  | Exclude<MessagePart, ReasoningUIPart>
  | CustomReasoningUIPart;

export type DataKeys = Exclude<
  ThreadMessage["parts"][number]["type"],
  | "reasoning"
  | "step-start"
  | "text"
  | "source-url"
  | "source-document"
  | "file"
>;
