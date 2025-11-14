"use client";

import { useEffect, useRef } from "react";
import { StickToBottom, useStickToBottom } from "use-stick-to-bottom";
import { Virtualizer, type VirtualizerHandle } from "virtua";
import { ChatInput } from "@/components/thread/chat-input";
import { useMessages } from "@/lib/threads-store/messages/provider";
import { useThreadSession } from "@/lib/threads-store/session/provider";
import { useThreads } from "@/lib/threads-store/threads/provider";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

export function MessageList() {
  const mounted = useRef(false);
  const ref = useRef<VirtualizerHandle>(null);
  const { messages } = useMessages();
  const { getThreadById } = useThreads();
  const { threadId } = useThreadSession();
  const thread = threadId ? getThreadById(threadId) : undefined;
  const isStreaming = thread?.status === "streaming";

  // Reverse messages array to show oldest-to-newest (top to bottom)
  const reversedMessages = messages.slice().reverse();

  const instance = useStickToBottom({
    initial: "instant",
    resize: isStreaming ? "smooth" : "instant",
  });

  useEffect(() => {
    if (mounted.current) {
      return;
    }

    ref.current?.scrollToIndex(reversedMessages.length - 1, {
      align: "end",
    });

    const timer = setTimeout(() => {
      mounted.current = true;
    }, 100);

    return () => clearTimeout(timer);
  }, [reversedMessages.length]);

  return (
    <StickToBottom
      className="absolute top-0 right-0 bottom-4 left-0"
      instance={instance}
    >
      <Virtualizer
        as={StickToBottom.Content}
        ref={ref}
        scrollRef={instance.scrollRef}
        ssrCount={reversedMessages.length}
      >
        <div className="mt-30 flex flex-col gap-2">
          {reversedMessages.map((message, index) => {
            const hasNextMessage = index < reversedMessages.length - 1;
            const hasPreviousMessage = index > 0;

            if (message.role === "user") {
              return (
                <UserMessage
                  hasNextMessage={hasNextMessage}
                  hasPreviousMessage={hasPreviousMessage}
                  id={message._id as string}
                  key={message._id as string}
                />
              );
            }

            // Assistant message - always use AssistantMessage component
            return (
              <AssistantMessage
                hasNextMessage={hasNextMessage}
                hasPreviousMessage={hasPreviousMessage}
                id={message._id as string}
                key={message._id as string}
              />
            );
          })}
        </div>
      </Virtualizer>
      <ChatInput />
    </StickToBottom>
  );
}
