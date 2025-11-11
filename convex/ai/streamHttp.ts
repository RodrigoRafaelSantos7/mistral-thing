import type { StreamId } from "@convex-dev/persistent-text-streaming";
import { PersistentTextStreaming } from "@convex-dev/persistent-text-streaming";
import { components, internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { httpAction } from "../_generated/server";

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming
);

export const streamChat = httpAction(async (ctx, request) => {
  const body = (await request.json()) as {
    streamId: string;
    messageId: string;
    threadId: string;
  };

  const generateChat = async (
    actionCtx: typeof ctx,
    _request: Request,
    streamId: string,
    chunkAppender: (chunk: string) => Promise<void>
  ) => {
    const { Mistral } = await import("@mistralai/mistralai");
    const client = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const context = await actionCtx.runQuery(
      internal.ai.streams.loadConversationContext,
      {
        threadId: body.threadId as Id<"thread">,
      }
    );

    const thread = await actionCtx.runQuery(
      internal.threads.getThreadForStream,
      {
        threadId: body.threadId as Id<"thread">,
      }
    );

    const settings = await actionCtx.runQuery(internal.settings.getForThread, {
      userId: thread.userId,
    });

    const result = await client.chat.stream({
      model: settings?.modelId ?? "mistral-small-latest",
      messages: context.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    for await (const chunk of result) {
      const streamText = chunk.data.choices[0].delta.content;
      if (typeof streamText === "string" && streamText.length > 0) {
        await chunkAppender(streamText);
      }
    }

    const finalContent = await actionCtx.runQuery(
      internal.ai.streams.getStreamBodyInternal,
      {
        streamId,
      }
    );

    if (finalContent?.text) {
      await actionCtx.runMutation(internal.ai.streams.updateMessageContent, {
        messageId: body.messageId as Id<"message">,
        content: finalContent.text,
      });
    }

    await actionCtx.runMutation(internal.ai.streams.completeStream, {
      threadId: body.threadId as Id<"thread">,
    });
  };

  const response = await persistentTextStreaming.stream(
    ctx,
    request,
    body.streamId as StreamId,
    generateChat
  );

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Vary", "Origin");
  return response;
});
