import { CopyIcon } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { MessageContainer } from "@/components/thread/message/message-container";
import { PendingMessage } from "@/components/thread/message/pending-message";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
} from "@/components/ui/message";
import { useMessages } from "@/lib/threads-store/messages/provider";

export const UserMessage = memo(function PureUserMessage({
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

  async function handleCopyClick() {
    const text = message?.content;

    if (!text) {
      return;
    }

    await copy(text);
    toast.success("Copied to clipboard");
  }

  return (
    <>
      <MessageContainer
        hasNextMessage={hasNextMessage}
        hasPreviousMessage={hasPreviousMessage}
      >
        <Message className="group/user-message flex w-full flex-col items-end">
          <div className="relative flex max-w-[80%] flex-col items-start gap-3 rounded-l-3xl rounded-tr-3xl rounded-br-lg border border-foreground/10 bg-muted px-4 py-3">
            {message?.content}
          </div>
          <MessageActions className="gap-1 transition-opacity duration-200 group-hover/user-message:opacity-100 md:opacity-0">
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
      {!hasNextMessage && (
        <MessageContainer
          className="justify-end"
          hasNextMessage={false}
          hasPreviousMessage={true}
        >
          <PendingMessage />
        </MessageContainer>
      )}
    </>
  );
});
