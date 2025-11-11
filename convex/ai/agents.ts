import { Mistral } from "@mistralai/mistralai";
import { action } from "../_generated/server";

const client = new Mistral({
  apiKey: process.env.MISTRAI_API_KEY,
});

export const sendChatMessage = action({
  args: {},
  handler: async () => {
    const result = await client.chat.stream({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: "What is the best French cheese?" }],
    });

    // If you want to print the stream text to the console
    for await (const chunk of result) {
      const streamText = chunk.data.choices[0].delta.content;
      if (typeof streamText === "string") {
        console.log(streamText);
      }
    }
  },
});
