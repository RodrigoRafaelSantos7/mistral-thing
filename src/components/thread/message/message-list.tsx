"use client";

import type { StreamId } from "@convex-dev/persistent-text-streaming";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import { useEffect, useRef } from "react";
import { StickToBottom, useStickToBottom } from "use-stick-to-bottom";
import { Virtualizer, type VirtualizerHandle } from "virtua";
import { ChatInput } from "@/components/thread/chat-input";
import { api } from "@/convex/_generated/api";
import { env } from "@/lib/env";
import { useMessages } from "@/lib/threads-store/messages/provider";
import type { Message } from "@/lib/threads-store/messages/utils";
import { useThreadSession } from "@/lib/threads-store/session/provider";
import { useThreads } from "@/lib/threads-store/threads/provider";

function StreamingMessageContent({ message }: { message: Message }) {
  // Convex site URL for HTTP actions - convert .cloud to .site
  const convexSiteUrl = env.NEXT_PUBLIC_CONVEX_SITE_URL;

  // For newly created streaming messages, this component should drive the stream
  const isDriven = message.isStreaming === true;

  const { text, status } = useStream(
    api.chat.getStreamBody,
    new URL(`${convexSiteUrl}/chat-stream`),
    isDriven,
    message.streamId as StreamId
  );

  // Use streamed text if available and streaming, otherwise use message content
  const displayText = status === "streaming" && text ? text : message.content;
  const isActive = status === "streaming" || message.isStreaming;

  return (
    <div className="whitespace-pre-wrap break-words">
      {displayText}
      {isActive && (
        <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-current opacity-75" />
      )}
    </div>
  );
}

function StreamingMessage({ message }: { message: Message }) {
  // Check if streamId is valid (not a temporary one)
  // Temporary stream IDs start with "temp-" and don't exist in the database
  const hasValidStreamId =
    message.streamId &&
    typeof message.streamId === "string" &&
    !message.streamId.startsWith("temp-");

  // If streamId is invalid, don't try to stream - just display the message content
  if (!hasValidStreamId) {
    return (
      <div className="whitespace-pre-wrap break-words">
        {message.content}
        {message.isStreaming && (
          <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-current opacity-75" />
        )}
      </div>
    );
  }

  // Only render the streaming component if we have a valid stream ID
  return <StreamingMessageContent message={message} />;
}

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
        <div className="mt-30 flex flex-col gap-2">
          {messages.map((message) =>
            message.isStreaming ? (
              <StreamingMessage key={message._id} message={message} />
            ) : (
              <div key={message._id}>{message.content}</div>
            )
          )}
        </div>
      </Virtualizer>
      <ChatInput />
    </StickToBottom>
  );
}
