"use client";

import { useEffect, useRef } from "react";
import { StickToBottom, useStickToBottom } from "use-stick-to-bottom";
import { Virtualizer, type VirtualizerHandle } from "virtua";

import { useMessages } from "@/lib/threads-store/messages/provider";
import { useThreadSession } from "@/lib/threads-store/session/provider";
import { useThreads } from "@/lib/threads-store/threads/provider";

export function MessageList() {
  const mounted = useRef(false);
  const ref = useRef<VirtualizerHandle>(null);
  const { messages } = useMessages();
  const { getThreadById } = useThreads();
  const { threadId } = useThreadSession();
  const thread = threadId ? getThreadById(threadId) : undefined;
  const isStreaming = thread?.status === "streaming";

  const instance = useStickToBottom({
    initial: "instant",
    resize: isStreaming ? "smooth" : "instant",
  });

  useEffect(() => {
    if (mounted.current) {
      return;
    }

    ref.current?.scrollToIndex(messages.length - 1, {
      align: "end",
    });

    const timer = setTimeout(() => {
      mounted.current = true;
    }, 100);

    return () => clearTimeout(timer);
  }, [messages.length]);

  return (
    <StickToBottom
      className="absolute top-0 right-0 bottom-4 left-0"
      instance={instance}
    >
      <Virtualizer
        as={StickToBottom.Content}
        ref={ref}
        scrollRef={instance.scrollRef}
        ssrCount={messages.length}
      >
        {messages.map((message) => message.content)}
      </Virtualizer>
    </StickToBottom>
  );
}
