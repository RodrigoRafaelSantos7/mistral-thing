import { httpRouter } from "convex/server";
import { streamChat } from "./ai/streamHttp";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({
  path: "/chat-stream",
  method: "POST",
  handler: streamChat,
});

export default http;
