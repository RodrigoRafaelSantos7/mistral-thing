"use client";

import { useEffect, useRef } from "react";
import { StickToBottom, useStickToBottom } from "use-stick-to-bottom";
import { Virtualizer, type VirtualizerHandle } from "virtua";
import { MessageItem } from "@/components/thread/message/message-item";
import { MultiModalInput } from "@/components/thread/multi-modal-input";
import { useAutoResume } from "@/hooks/use-auto-resume";
import type { Thread } from "@/types/thread";

const MESSAGE_LIST_SCROLL_DELAY = 100;

export function MessageList({ thread }: { thread: Thread }) {
  const mounted = useRef(false);
  const ref = useRef<VirtualizerHandle>(null);

  const messageIds = (thread.messages ?? [])
    .map((message) => message?._id)
    .filter((id): id is NonNullable<typeof id> => id !== undefined);

  const isStreaming = thread.status === "streaming";

  const instance = useStickToBottom({
    initial: "instant",
    resize: isStreaming ? "smooth" : "instant",
  });

  useAutoResume();

  useEffect(() => {
    if (mounted.current || !instance.scrollRef) {
      return;
    }

    ref.current?.scrollToIndex(messageIds.length - 1, {
      align: "end",
    });

    const timer = setTimeout(() => {
      mounted.current = true;
    }, MESSAGE_LIST_SCROLL_DELAY);

    return () => clearTimeout(timer);
  }, [messageIds.length, instance.scrollRef]);

  if (!instance.scrollRef) {
    return null;
  }

  return (
    <StickToBottom
      className="absolute top-0 right-0 bottom-0 left-0"
      instance={instance}
    >
      <Virtualizer
        as={StickToBottom.Content}
        ref={ref}
        scrollRef={instance.scrollRef}
        ssrCount={5}
      >
        {messageIds.map((id) => (
          <MessageItem id={id} key={id} />
        ))}
      </Virtualizer>
      <MultiModalInput />
    </StickToBottom>
  );
}
