import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Retrieves all models with authorization checks.
 *
 * @returns All models
 * @throws {ConvexError} 401 if user not authenticated
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "Please login to continue.",
        severity: "high",
      });
    }

    const models = await ctx.db.query("model").collect();

    return models;
  },
});

export const seedModels = mutation({
  handler: async (ctx) => {
    const modelsArray = [
      {
        name: "Codestral",
        model: "codestral-latest" as const,
        description:
          "Mistral's cutting-edge language model for coding released end of July 2025, Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM), code correction and test generation.",
        capabilities: ["text-input" as const, "text-output" as const],
        icon: "codestral" as const,
        credits: 1,
      },
      {
        name: "Mistral Medium 3.1",
        model: "mistral-medium-latest" as const,
        description:
          "Mistral's frontier-class multimodal model released August 2025. Improving tone and performance. This model requires an account to use.",
        capabilities: [
          "text-input" as const,
          "image-input" as const,
          "text-output" as const,
        ],
        icon: "medium" as const,
        credits: 1,
      },
      {
        name: "Mistral Small 3.2",
        model: "mistral-small-latest" as const,
        description:
          "Mistral's update to their previous small model, released June 2025. Ideal for quick tasks and small conversations. This model requires an account to use.",
        capabilities: [
          "text-input" as const,
          "image-input" as const,
          "text-output" as const,
        ],
        icon: "small" as const,
        credits: 1,
      },
      {
        name: "Magistral Medium 1.2",
        model: "magistral-medium-latest" as const,
        description:
          "Mistral's frontier-class multimodal reasoning model update of September 2025. Ideal for complex tasks and conversations. Requires an account to use.",
        capabilities: [
          "text-input" as const,
          "image-input" as const,
          "text-output" as const,
          "reasoning-output" as const,
        ],
        icon: "magistral" as const,
        credits: 1,
      },
      {
        name: "Voxtral Mini",
        model: "voxtral-mini-latest" as const,
        description:
          "A mini version of Mistral's first audio input model. Ideal for transcribing audio to text.",
        capabilities: [
          "voice-input" as const,
          "text-input" as const,
          "text-output" as const,
        ],
        icon: "voxtral" as const,
        credits: 1,
      },
      {
        name: "Voxtral Small",
        model: "voxtral-small-latest" as const,
        description:
          "Mistral's first model with audio input capabilities for instructing use cases. Ideal for transcribing audio to text.",
        capabilities: [
          "voice-input" as const,
          "text-input" as const,
          "text-output" as const,
        ],
        icon: "voxtral" as const,
        credits: 1,
      },
      {
        name: "Devstral Small 1.1",
        model: "devstral-small-2507" as const,
        description:
          "An update to Mistral's open source model that excels at using tools to explore codebases, editing multiple files and power software engineering agents.",
        capabilities: ["text-input" as const, "text-output" as const],
        icon: "devstral" as const,
        credits: 1,
      },
      {
        name: "Pixtral 12B",
        model: "pixtral-12b-2409" as const,
        description:
          "A 12B model with image understanding capabilities in addition to text. Ideal for image understanding tasks and conversations.",
        capabilities: [
          "text-input" as const,
          "text-output" as const,
          "image-input" as const,
        ],
        icon: "pixtral" as const,
        credits: 1,
      },
      {
        name: "Mistral Nemo 12B",
        model: "open-mistral-nemo" as const,
        description:
          "Mistral's best multilingual open source model released July 2024. Ideal for multilingual tasks and conversations.",
        capabilities: [
          "text-input" as const,
          "text-output" as const,
          "image-input" as const,
        ],
        icon: "nemo" as const,
        credits: 1,
      },
    ];

    await ctx.db
      .query("model")
      .collect()
      .then(async (existingModels) => {
        for (const model of existingModels) {
          await ctx.db.delete(model._id);
        }
      });

    for (const model of modelsArray) {
      await ctx.db.insert("model", model);
    }
  },
});
