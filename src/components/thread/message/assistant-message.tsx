import type { StreamId } from "@convex-dev/persistent-text-streaming";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import { CopyIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { memo } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { MessageContainer } from "@/components/thread/message/message-container";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
} from "@/components/ui/message";
import { api } from "@/convex/_generated/api";
import { env } from "@/lib/env";
import { useMessages } from "@/lib/threads-store/messages/provider";

const Markdown = dynamic(() =>
  import("@/components/ui/markdown").then((mod) => mod.Markdown)
);

export const AssistantMessage = memo(function PureAssistantMessage({
  id,
  hasNextMessage: propHasNextMessage,
  hasPreviousMessage: propHasPreviousMessage,
}: {
  id: string;
  hasNextMessage?: boolean;
  hasPreviousMessage?: boolean;
}) {
  const [_, copy] = useCopyToClipboard();
  const { messages } = useMessages();
  const index = messages.findIndex((messageItem) => messageItem._id === id);
  const message = messages[index];
  const hasNextMessage = propHasNextMessage ?? messages.length > index + 1;
  const hasPreviousMessage = propHasPreviousMessage ?? index > 0;

  // Check if message has streaming state
  const isStreaming = message?.isStreaming;
  const hasValidStreamId =
    message?.streamId &&
    typeof message.streamId === "string" &&
    !message.streamId.startsWith("temp-");

  // Convex site URL for HTTP actions - use SITE_URL if available, otherwise fallback to CONVEX_URL
  const convexSiteUrl =
    env.NEXT_PUBLIC_CONVEX_SITE_URL || env.NEXT_PUBLIC_CONVEX_URL;

  // For newly created streaming messages, this component should drive the stream
  const isDriven = isStreaming === true;

  // Use stream hook - always provide URL, but only activate when we have a valid stream ID
  // The hook will handle the case when streamId is undefined
  const { text, status } = useStream(
    api.chat.getStreamBody,
    new URL(`${convexSiteUrl}/chat-stream`),
    hasValidStreamId ? isDriven : false,
    hasValidStreamId ? (message?.streamId as StreamId) : undefined
  );

  // Display streamed text if available and streaming, otherwise use message content
  const displayText =
    hasValidStreamId && status === "streaming" && text
      ? text
      : message?.content || "";

  // Show cursor when actively streaming
  const isActive = hasValidStreamId && (status === "streaming" || isStreaming);

  async function handleCopyClick() {
    const textToCopy = displayText;

    if (!textToCopy) {
      return;
    }

    await copy(textToCopy);
    toast.success("Copied to clipboard");
  }

  return (
    <MessageContainer
      className="justify-start"
      hasNextMessage={hasNextMessage}
      hasPreviousMessage={hasPreviousMessage}
    >
      <Message className="group/assistant-message flex w-full flex-col items-start">
        <div className="relative flex max-w-[80%] flex-col items-start gap-3 rounded-r-3xl rounded-tl-3xl rounded-bl-lg border border-foreground/10 bg-muted px-4 py-3">
          {displayText && (
            <Markdown className="prose prose-sm dark:prose-invert max-w-none prose-a:text-foreground prose-blockquote:text-foreground prose-code:text-foreground prose-headings:text-foreground prose-li:text-foreground prose-p:text-foreground prose-pre:text-foreground prose-strong:text-foreground">
              {displayText}
            </Markdown>
          )}
          {isActive && (
            <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-current opacity-75" />
          )}
        </div>
        <MessageActions className="gap-1 transition-opacity duration-200 group-hover/assistant-message:opacity-100 md:opacity-0">
          <MessageAction side="bottom" tooltip="Copy">
            <Button
              className="size-8"
              onClick={handleCopyClick}
              size="icon"
              variant="ghost"
            >
              <CopyIcon className="size-3" />
            </Button>
          </MessageAction>
        </MessageActions>
      </Message>
    </MessageContainer>
  );
});
