/** biome-ignore-all lint/complexity/noUselessLoneBlockStatements: <explanation> */
import { Chat } from "@/components/chat/chat";
import { LayoutApp } from "@/components/layout/layout-app";
import { MessagesProvider } from "@/lib/chat-store/messages/provider";

{
  /** "use client";

import { useMutation, useQuery } from "convex/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageItem from "@/components/app/message-item";
import { ServerMessage } from "@/components/app/server-message";
import { LayoutApp } from "@/components/layout/layout-app";
import { api } from "@/convex/_generated/api";
export default function ChatWindow() {
  const [drivenIds, setDrivenIds] = useState<Set<string>>(new Set());
  const [isStreaming, setIsStreaming] = useState(false);
  const messages = useQuery(api.messages.listMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clearAllMessages = useMutation(api.messages.clearMessages);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const sendMessage = useMutation(api.messages.sendMessage);

  if (!messages) {
    return null;
  }

  return (
    <LayoutApp>
      <div className="flex h-full flex-1 flex-col">
        <div
          className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-12"
          ref={messageContainerRef}
        >
          <div className="mx-auto w-full max-w-5xl space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                No messages yet. Start the conversation!
              </div>
            )}
            {messages.map((message) => (
              <React.Fragment key={message._id}>
                <MessageItem isUser={true} message={message}>
                  {message.content}
                </MessageItem>
                <MessageItem isUser={false} message={message}>
                  <ServerMessage
                    isDriven={drivenIds.has(message._id)}
                    message={message}
                    scrollToBottom={scrollToBottom}
                    stopStreaming={() => {
                      setIsStreaming(false);
                      focusInput();
                    }}
                  />
                </MessageItem>
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-gray-200 border-t px-4 py-6 md:px-8 lg:px-12">
          <form
            className="mx-auto w-full max-w-5xl"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!inputValue.trim()) {
                return;
              }

              setInputValue("");

              const chatId = await sendMessage({
                prompt: inputValue,
              });

              setDrivenIds((prev) => {
                prev.add(chatId);
                return prev;
              });

              setIsStreaming(true);
            }}
          >
            <div className="flex items-center gap-3">
              <input
                className="flex-1 rounded-lg border border-gray-300 p-4 text-base text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isStreaming}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                ref={inputRef}
                value={inputValue}
              />
              <button
                className="rounded-lg bg-blue-600 px-8 py-4 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-200"
                disabled={!inputValue.trim() || isStreaming}
                type="submit"
              >
                Send
              </button>
              <button
                className="rounded-lg bg-red-600 px-8 py-4 font-medium text-white transition-colors hover:bg-red-700 disabled:bg-gray-400 disabled:text-gray-200"
                disabled={messages.length < 2 || isStreaming}
                onClick={() => {
                  clearAllMessages();
                  setInputValue("");
                  setIsStreaming(false);
                  focusInput();
                }}
                type="button"
              >
                Clear Chat
              </button>
            </div>
            {isStreaming && (
              <div className="mt-2 text-gray-500 text-xs">
                AI is responding...
              </div>
            )}
          </form>
        </div>
      </div>
    </LayoutApp>
  );
}
*/
}

export default function Page() {
  return (
    <MessagesProvider>
      <LayoutApp>
        <Chat />
      </LayoutApp>
    </MessagesProvider>
  );
}
