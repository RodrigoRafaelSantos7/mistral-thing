import type { StreamId } from "@convex-dev/persistent-text-streaming";
import { Mistral } from "@mistralai/mistralai";
import { httpAction } from "./_generated/server";
import { streamingComponent } from "./streaming";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export const streamChat = httpAction(async (ctx, request) => {
  const body = (await request.json()) as {
    streamId: string;
  };

  // Start streaming and persisting at the same time while
  // we immediately return a streaming response to the client
  const response = await streamingComponent.stream(
    ctx,
    request,
    body.streamId as StreamId,
    async (_ctx, _request, _streamId, append) => {
      // Lets grab the history up to now so that the AI has some context
      // const history = await ctx.runQuery(internal.messages.getHistory);

      // Lets kickoff a stream request to OpenAI
      const stream = await client.chat.stream({
        model: "mistral-small-latest",
        messages: [
          { role: "user", content: "What is the best French cheese?" },
        ],
      });

      for await (const chunk of stream) {
        const streamText = chunk.data.choices[0].delta.content;
        if (typeof streamText === "string") {
          await append(streamText);
        }
      }
    }
  );

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Vary", "Origin");

  return response;
});
