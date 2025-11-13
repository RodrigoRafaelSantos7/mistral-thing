/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: we want to allow static elements to be interactive */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: we want to allow static elements to be interactive */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: we want to allow key events to be used with click events */

"use client";

import { ArrowUpIcon, StopIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";

type ChatInputProps = {
  value: string;
  onValueChangeAction: (value: string) => void;
  onSendAction: () => void;
  isSubmitting?: boolean;
  stopAction: () => void;
  status?: "submitted" | "streaming" | "ready" | "error";
  quotedText?: { text: string; messageId: string } | null;
};

const nonWhitespaceRegex = /[^\s]/;

export function ChatInput({
  value,
  onValueChangeAction,
  onSendAction,
  isSubmitting,
  stopAction,
  status,
  quotedText,
}: ChatInputProps) {
  const isOnlyWhitespace = (text: string) => !nonWhitespaceRegex.test(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    if (status === "streaming") {
      stopAction();
      return;
    }

    onSendAction();
  }, [isSubmitting, onSendAction, status, stopAction]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-run this callback when the value changes
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isSubmitting) {
        e.preventDefault();
        return;
      }

      if (e.key === "Enter" && status === "streaming") {
        e.preventDefault();
        return;
      }

      if (e.key === "Enter" && !e.shiftKey) {
        if (isOnlyWhitespace(value)) {
          return;
        }

        e.preventDefault();
        onSendAction();
      }
    },
    [isSubmitting, onSendAction, status, value]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-run this effect when quotedText changes
  useEffect(() => {
    if (quotedText) {
      const quoted = quotedText.text
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
      onValueChangeAction(
        value ? `${value}\n\n${quoted}\n\n` : `${quoted}\n\n`
      );

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [quotedText, onValueChangeAction]);

  return (
    <div className="relative flex w-full flex-col gap-4">
      <div
        className="relative order-2 px-2 pb-3 sm:pb-4 md:order-1"
        onClick={() => textareaRef.current?.focus()}
      >
        <PromptInput
          className="relative z-10 bg-popover p-0 pt-1 shadow-xs backdrop-blur-xl"
          maxHeight={200}
          onValueChange={onValueChangeAction}
          value={value}
        >
          <PromptInputTextarea
            className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            onKeyDown={handleKeyDown}
            placeholder="Ask Mistral"
            ref={textareaRef}
          />
          <PromptInputActions className="mt-3 w-full justify-between p-2">
            <div className="flex gap-2">
              {/* TODO: Add file upload button */}
            </div>
            <PromptInputAction
              tooltip={status === "streaming" ? "Stop" : "Send"}
            >
              <Button
                aria-label={status === "streaming" ? "Stop" : "Send message"}
                className="size-9 rounded-full transition-all duration-300 ease-out"
                disabled={!value || isSubmitting || isOnlyWhitespace(value)}
                onClick={handleSend}
                size="sm"
                type="button"
              >
                {status === "streaming" ? (
                  <StopIcon className="size-4" />
                ) : (
                  <ArrowUpIcon className="size-4" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}
