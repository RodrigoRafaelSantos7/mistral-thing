import type { StreamId } from "@convex-dev/persistent-text-streaming";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import { CopyIcon } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { MessageContainer } from "@/components/thread/message/message-container";
import { PendingMessage } from "@/components/thread/message/pending-message";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import {
  Message,
  MessageAction,
  MessageActions,
} from "@/components/ui/message";
import { api } from "@/convex/_generated/api";
import { env, getConvexSiteUrl } from "@/lib/env";
import type { Message as MessageType } from "@/types/thread";

export const AssistantMessage = memo(function PureAssistantMessage({
  message,
  hasNextMessage,
  hasPreviousMessage,
}: {
  message: MessageType;
  hasPreviousMessage: boolean;
  hasNextMessage: boolean;
}) {
  const streamId = message.streamId as StreamId | undefined;
  const isStreaming = streamId !== undefined;

  const streamBody = useStream(
    api.ai.streams.getStreamBody,
    streamId
      ? new URL(`${getConvexSiteUrl(env.NEXT_PUBLIC_CONVEX_URL)}/chat-stream`)
      : new URL("http://localhost"),
    isStreaming,
    streamId
  );

  const displayContent =
    streamId && streamBody?.text ? streamBody.text : message.content;
  const hasContent = displayContent && displayContent.trim().length > 0;

  if (!hasContent) {
    return (
      <MessageContainer
        className="justify-start"
        hasNextMessage={false}
        hasPreviousMessage={true}
      >
        <PendingMessage />
      </MessageContainer>
    );
  }

  async function handleCopyClick() {
    if (!displayContent) {
      return;
    }

    await navigator.clipboard.writeText(displayContent);
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
          <Markdown>{displayContent}</Markdown>
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
