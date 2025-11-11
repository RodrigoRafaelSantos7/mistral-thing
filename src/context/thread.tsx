/** biome-ignore-all lint/suspicious/noExplicitAny: Here typing will  */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: This will happen on every render */
/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: This is a complex algorithm */
/** biome-ignore-all lint/suspicious/noEvolvingTypes: This is a complex algorithm */
/** biome-ignore-all lint/suspicious/noExplicitAny: Here typing will be dynamic */
import type { ChatInit } from "ai";
import { createContext, useContext, useEffect, useMemo } from "react";
import type { ThreadMessage, TransformedMessagePart } from "@/ai/types";
import { nanoid } from "@/lib/utils";
import { Thread } from "@/thread";
import type { ThreadStoreImpl } from "@/thread/store";

const ThreadContext = createContext<Thread<ThreadMessage> | null>(null);

const threads = new Map<string, Thread<ThreadMessage>>();

export function ThreadProvider({
  children,
  ...init
}: {
  children: React.ReactNode;
} & ChatInit<ThreadMessage>) {
  const generateId = init.generateId ?? nanoid;

  const id = useMemo(() => {
    if (init.id) {
      return init.id;
    }

    return generateId();
  }, [init.id, generateId]);

  const thread = useMemo(() => {
    if (threads.has(id)) {
      // biome-ignore lint/style/noNonNullAssertion: Thread already exists
      return threads.get(id)!;
    }

    const newThread = new Thread<ThreadMessage>({ ...init, id });

    threads.set(id, newThread);

    return newThread;
  }, [id]);

  useEffect(() => {
    if (
      init.messages &&
      init.messages.length > 0 &&
      init.messages.length >= thread.store.getState().messages.length
    ) {
      thread.store.getState().setMessages(init.messages);
    }
  }, [init.messages, id]);

  return (
    <ThreadContext.Provider value={thread}>{children}</ThreadContext.Provider>
  );
}

export function useThreadContext() {
  const thread = useContext(ThreadContext);
  if (!thread) {
    throw new Error("useThreadContext must be used within a ThreadProvider");
  }
  return thread;
}

export function useThreadSelector<T>(
  selector: (state: ThreadStoreImpl<ThreadMessage>) => T,
  equalityFn?: (a: T, b: T) => boolean
) {
  return useThreadContext().store(selector, equalityFn);
}

type PartType = ThreadMessage["parts"][number]["type"];

export function usePart<Return, SelectReturn>(options: {
  id: string;
  index: number;
  type: "reasoning";
  selector: (
    part: Extract<TransformedMessagePart, { type: "reasoning" }> | null
  ) => SelectReturn;
  equalityFn?: (a: Return | null, b: Return | null) => boolean;
}): SelectReturn;

export function usePart<
  T extends Exclude<PartType, "reasoning">,
  Return,
  SelectReturn,
>(options: {
  id: string;
  index: number;
  type: T;
  selector: (
    part: Extract<TransformedMessagePart, { type: T }>
  ) => SelectReturn;
  equalityFn?: (a: Return, b: Return) => boolean;
}): SelectReturn;

export function usePart(options: any): any {
  const part = usePartSelector<any>((parts) => {
    const currentPart = { ...parts[options.index] };
    if (currentPart.type !== options.type) {
      throw new Error("Part type mismatch");
    }

    return options.selector(currentPart as any);
  });

  return part as any;
}

export const MessageContext = createContext<string | undefined>(undefined);

const useMessageContext = () => {
  const message = useContext(MessageContext);
  if (!message) {
    throw new Error("useMessageContext must be used within a MessageContext");
  }
  return message;
};

export function usePartSelector<T>(
  selector: (parts: TransformedMessagePart[]) => T
) {
  const id = useMessageContext();

  return useThreadSelector((state) => {
    const parts = [...state.messageMap[id].parts];
    const partsWithTimestamp = parts
      .map((part, i) => {
        if (part.type === "reasoning") {
          // Search backwards from current position to find start timing part
          let startPart = null;
          for (let j = i - 1; j >= 0; j--) {
            const candidatePart = parts[j];
            if (
              candidatePart?.type === "data-reasoning-time" &&
              "data" in candidatePart &&
              candidatePart.data.type === "start"
            ) {
              startPart = candidatePart;
              break;
            }
          }

          if (!startPart) {
            return {
              ...part,
              startTime: null,
              endTime: null,
            };
          }

          // Search forwards from current position to find end timing part
          let endPart = null;
          for (let j = i + 1; j < parts.length; j++) {
            const candidatePart = parts[j];
            if (
              candidatePart?.type === "data-reasoning-time" &&
              "data" in candidatePart &&
              candidatePart.data.type === "end"
            ) {
              endPart = candidatePart;
              break;
            }
          }

          if (!endPart) {
            return {
              ...part,
              startTime: startPart.data.timestamp,
              endTime: null,
            };
          }

          return {
            ...part,
            startTime: startPart.data.timestamp,
            endTime: endPart.data.timestamp,
          };
        }

        return part;
      })
      .filter((part) => part.type !== "data-reasoning-time")
      .reduce((acc, part) => {
        const previousPart = acc.at(-1);
        if (previousPart?.type === "reasoning" && part.type === "reasoning") {
          previousPart.text = `${previousPart.text}\n\n${part.text}`;
          previousPart.state = part.state;
          previousPart.endTime = part.endTime;
          return acc;
        }
        acc.push(part as TransformedMessagePart);
        return acc;
      }, [] as TransformedMessagePart[]);

    return selector(partsWithTimestamp);
  });
}
