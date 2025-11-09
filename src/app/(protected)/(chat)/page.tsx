"use client";

import { useAction, useMutation } from "convex/react";
import { PlusIcon, SendIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const createThread = useMutation(api.chats.createThread);
  const sendMessage = useAction(api.chats.sendMessageToAgent);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageIdCounter = useRef(0);

  const handleSendMessage = async () => {
    if (!(input.trim() && threadId) || isLoading) {
      return;
    }

    const userMessage = input.trim();
    setInput("");
    messageIdCounter.current += 1;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${messageIdCounter.current}`,
        role: "user",
        content: userMessage,
      },
    ]);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        threadId,
        prompt: userMessage,
      });
      messageIdCounter.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${messageIdCounter.current}`,
          role: "assistant",
          content: response,
        },
      ]);
    } catch {
      messageIdCounter.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${messageIdCounter.current}`,
          role: "assistant",
          content: "Sorry, there was an error processing your message.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    const newThreadId = await createThread({
      model: "mistral-small-latest",
    });
    setThreadId(newThreadId);
    setMessages([]);
    messageIdCounter.current = 0;
  };

  return (
    <div className="relative flex flex-1 flex-col">
      <Header />

      <div className="mt-32 flex flex-1 flex-col gap-4 p-4">
        <Button onClick={handleNewChat} variant="outline">
          <PlusIcon className="h-4 w-4" />
          New Chat
        </Button>

        {threadId && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-lg border p-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground">Start a conversation...</p>
              ) : (
                messages.map((message) => (
                  <div
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    key={message.id}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                className="min-h-20"
                disabled={isLoading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                value={input}
              />
              <Button
                className="h-20 w-20"
                disabled={!input.trim() || isLoading}
                onClick={handleSendMessage}
                size="icon"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
