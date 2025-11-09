import { createMistral } from "@ai-sdk/mistral";
import { Agent, vStreamArgs } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { api, components } from "./_generated/api";
import { action, type GenericCtx, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

/**
 * Creates a new agent for a chat thread with a given model.
 * @param ctx - The convex context.
 * @param model - The model to use for the chat thread.
 * @returns The agent for the chat thread.
 */
async function createAgent(ctx: GenericCtx, model: string): Promise<Agent> {
  const settings = await ctx.runQuery(api.settings.get, {});

  return new Agent(components.agent, {
    name: "Mistral Thing Agent",
    languageModel: mistral.chat(model),
    textEmbeddingModel: mistral.textEmbedding("mistral-embed"),
    instructions: settings?.instructions ?? undefined,
    maxSteps: 10,
  });
}

const myAgent = new Agent(components.agent, {
  name: "Mistral Thing Agent",
  languageModel: mistral.chat("mistral-small-latest"),
  textEmbeddingModel: mistral.textEmbedding("mistral-embed"),
  maxSteps: 10,
});

/**
 * Creates a new chat thread with a given model.
 * @param ctx - The convex context.
 * @param args.model - The model to use for the chat thread.
 * @returns The ID of the new chat thread.
 */
export const createThread = mutation({
  args: {
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const agent = await createAgent(ctx, args.model);

    const { threadId } = await agent.createThread(ctx, {
      userId: user._id as string,
    });

    return threadId;
  },
});

export const sendMessageToAgent = action({
  args: {
    threadId: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const { thread } = await myAgent.continueThread(ctx, {
      threadId: args.threadId,
    });

    const result = await thread.streamText(
      { prompt: args.prompt },
      {
        saveStreamDeltas: {
          chunking: "word",
        },
      }
    );

    await result.consumeStream();
  },
});

export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    const paginated = await myAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    const streams = await myAgent.syncStreams(ctx, {
      threadId: args.threadId,
      streamArgs: args.streamArgs,
    });

    return {
      ...paginated,
      streams,
    };
  },
});
