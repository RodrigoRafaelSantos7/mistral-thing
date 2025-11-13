/** biome-ignore-all lint/complexity/noUselessFragments: <explanation> */
"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMessages } from "@/lib/chat-store/messages/provider";
import { useChatSession } from "@/lib/chat-store/session/provider";
import { cn } from "@/lib/utils";

export function Chat() {
  const { messages } = useMessages();
  const { chatId } = useChatSession();

  const showOnboarding = !chatId && messages.length === 0;

  return (
    <div
      className={cn(
        "@container/main relative flex h-full flex-col items-center justify-end md:justify-center"
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {showOnboarding ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute bottom-[60%] mx-auto max-w-[50rem] md:relative md:bottom-auto"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="onboarding"
            layout="position"
            layoutId="onboarding"
            transition={{
              layout: {
                duration: 0,
              },
            }}
          >
            <h1 className="mb-6 font-medium text-3xl tracking-tight">
              What&apos;s on your mind?
            </h1>
          </motion.div>
        ) : (
          <></>
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          "relative inset-x-0 bottom-0 z-50 mx-auto w-full max-w-3xl"
        )}
        layout="position"
        layoutId="chat-input-container"
        transition={{
          layout: {
            duration: messages.length === 1 ? 0.3 : 0,
          },
        }}
      >
        <></>
      </motion.div>
    </div>
  );
}
