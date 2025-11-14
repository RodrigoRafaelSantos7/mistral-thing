"use client";

import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { match, P } from "ts-pattern";
import { ScrollToBottomButton } from "@/components/thread/scroll-to-bottom-button";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Message } from "@/lib/threads-store/messages/utils";
import { useThreadSession } from "@/lib/threads-store/session/provider";
import { useThreads } from "@/lib/threads-store/threads/provider";
import { cn } from "@/lib/utils";
import { threadPath } from "@/paths";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const [, startTransition] = useTransition();
  const { threads, createThreadAndSendMessage } = useThreads();
  const { threadId } = useThreadSession();
  const thread = threads.find((threadItem) => threadItem._id === threadId);
  const status = thread?.status ?? "ready";

  const sendMessage = useMutation(api.chat.sendMessage).withOptimisticUpdate(
    (localStore, args) => {
      const now = Date.now();

      // Update messages query
      const currentMessages = localStore.getQuery(
        api.messages.getMessagesForThread,
        { threadId: args.threadId }
      );

      if (currentMessages !== undefined && currentMessages !== null) {
        const tempUserMessageId = `temp-user-${now}` as Id<"messages">;

        const userMessage: Message = {
          _id: tempUserMessageId,
          _creationTime: now,
          threadId: args.threadId,
          role: "user",
          content: args.content,
        };

        const updatedMessages = [userMessage, ...currentMessages];
        localStore.setQuery(
          api.messages.getMessagesForThread,
          { threadId: args.threadId },
          updatedMessages
        );
      }
    }
  );

  const router = useRouter();

  const handleSubmit = async () => {
    if (!input?.trim()) {
      return;
    }

    if (threadId) {
      await sendMessage({
        threadId,
        content: input,
      });
    } else {
      // Generate slug immediately for instant navigation
      const slug = nanoid();

      // Start mutation first to trigger optimistic updates immediately
      createThreadAndSendMessage({
        content: input,
        slug,
      }).catch((error) => {
        console.error("Failed to create thread:", error);
        // Optionally handle error (e.g., show toast notification)
      });

      // Navigate instantly in a transition (non-blocking, low priority)
      startTransition(() => {
        router.push(threadPath(slug));
      });
    }

    // Reset form state
    setInput("");
  };

  const matcher = useMemo(
    () =>
      match({
        status,
        input,
      }),
    [status, input]
  );

  return (
    <motion.form
      className={cn({
        "absolute flex flex-col gap-4 px-4 pt-4": true,
        "right-0 bottom-0 left-0": true,
        "top-[25vh]": !threadId,
      })}
      layoutId="multi-modal-input"
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmit();
      }}
      transition={{ type: "spring", stiffness: 1000, damping: 40 }}
    >
      {!threadId && (
        <motion.div
          animate={{ opacity: 1 }}
          className="mx-auto max-w-3xl font-serif"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl">What's on your mind?</h2>
        </motion.div>
      )}
      <ScrollToBottomButton variant="default" />
      <PromptInput
        className="mx-auto w-full max-w-3xl overflow-hidden border-foreground/10 bg-muted/50 p-0 backdrop-blur-md"
        onSubmit={handleSubmit}
        onValueChange={setInput}
        value={input}
      >
        <PromptInputTextarea
          className="px-6"
          placeholder="Ask me anything..."
        />
        <PromptInputActions className="flex items-center px-3 pb-3">
          <div className="flex-1" />
          <PromptInputAction
            tooltip={matcher
              .with(
                {
                  input: P.string.maxLength(0),
                  status: "ready",
                },
                () => "Message cannot be empty"
              )
              .with(
                { status: P.union("streaming", "submitted") },
                () => "Stop generation"
              )
              .otherwise(() => "Send message")}
          >
            <Button
              className="h-8 w-8 rounded-full"
              disabled={matcher
                .with(
                  {
                    input: P.string.maxLength(0),
                    remainingCredits: P.number.gt(0),
                    status: "ready",
                  },
                  () => true
                )
                .with(
                  { status: P.union("streaming", "submitted") },
                  () => false
                )
                .otherwise(() => false)}
              size="icon"
              type="submit"
              variant="default"
            >
              {status === "streaming" || status === "submitted" ? (
                <SquareIcon className="size-5 fill-current" />
              ) : (
                <ArrowUpIcon className="size-5" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </motion.form>
  );
};

export { ChatInput };
