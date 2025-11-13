import { httpRouter } from "convex/server";
import { httpAction } from "@/convex/_generated/server";
import { streamChat } from "@/convex/chat";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Add CORS headers for chat-stream
http.route({
  path: "/chat-stream",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const headers = await request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
          "Access-Control-Max-Age": "86400",
        }),
      });
    }
    return new Response();
  }),
});

// Add the chat stream route
http.route({
  path: "/chat-stream",
  method: "POST",
  handler: streamChat,
});

export default http;
