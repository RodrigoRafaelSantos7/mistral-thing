import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowUpIcon, EditIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollToBottomButton } from "@/components/thread/scroll-to-bottom-button";
import { Button } from "@/components/ui/button";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/hooks/use-database";
import { useParamsThreadId } from "@/hooks/use-params-thread-id";
import { env, getConvexSiteUrl } from "@/lib/env";
import { getUsername } from "@/lib/usernames";
import { cn } from "@/lib/utils";

export function MultiModalInput() {
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] =
    useState<Id<"message"> | null>(null);
  const user = useUser();
  const threadId = useParamsThreadId() as Id<"thread"> | undefined;
  const createMessage = useMutation(api.threads.createMessage);
  const createStream = useMutation(api.ai.streams.createStream);

  useQuery(api.threads.getThreadById, threadId ? { threadId } : "skip");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input?.trim();
    if (!(trimmedInput && threadId)) {
      return;
    }

    try {
      await createMessage({
        threadId,
        content: trimmedInput,
      });

      const { messageId, streamId } = await createStream({
        threadId,
      });

      const convexSiteUrl = getConvexSiteUrl(env.NEXT_PUBLIC_CONVEX_URL);
      const response = await fetch(`${convexSiteUrl}/chat-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          streamId,
          messageId,
          threadId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to start stream: ${response.status} ${response.statusText}`
        );
      }

      // Reset form state
      setInput("");
      setEditingMessageId(null);
    } catch (error) {
      // Error handling with user-friendly feedback
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.";
      toast.error(errorMessage);
    }
  };

  const isDisabled = !(input?.trim() && threadId);

  return (
    <motion.form
      className={cn(
        "absolute flex flex-col gap-4 px-4 pt-4",
        "right-0 bottom-0 left-0",
        !threadId && "top-[25vh]"
      )}
      layoutId="multi-modal-input"
      onSubmit={handleSubmit}
      transition={{ type: "spring", stiffness: 1000, damping: 40 }}
    >
      {!threadId && (
        <motion.div
          animate={{ opacity: 1 }}
          className="mx-auto max-w-3xl font-serif"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl">
            Hello,{" "}
            {getUsername(user ? { id: user._id, name: user.name } : undefined)}
          </h2>
        </motion.div>
      )}
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-foreground/10 bg-muted/50 backdrop-blur-md">
        {editingMessageId && (
          <div className="flex items-center justify-between border-foreground/10 border-b bg-sidebar/30 px-3 py-3 text-muted-foreground text-xs backdrop-blur-md">
            <div className="flex items-center gap-2">
              <EditIcon className="size-4" />
              <p>Editing message</p>
            </div>
            <Button
              className="size-6"
              onClick={() => {
                setEditingMessageId(null);
                setInput("");
              }}
              size="icon"
              type="button"
              variant="ghost"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        )}
        <ScrollToBottomButton variant="default" />
        <PromptInput
          className="mx-auto w-full max-w-3xl overflow-hidden border-foreground/10 bg-muted/50 p-0 backdrop-blur-md"
          onSubmit={() => handleSubmit}
          onValueChange={setInput}
          value={input}
        >
          <PromptInputTextarea
            className="min-h-[60px] resize-none px-4"
            placeholder="Ask me anything..."
          />
          <Button
            className="h-8 w-8 shrink-0 rounded-full"
            disabled={isDisabled}
            size="icon"
            type="submit"
            variant="default"
          >
            <ArrowUpIcon className="size-5" />
          </Button>
        </PromptInput>
      </div>
    </motion.form>
  );
}
