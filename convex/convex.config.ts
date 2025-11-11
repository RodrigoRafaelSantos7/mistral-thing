import agent from "@convex-dev/agent/convex.config";
import betterAuth from "@convex-dev/better-auth/convex.config";
import persistentTextStreaming from "@convex-dev/persistent-text-streaming/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(betterAuth);
app.use(resend);
app.use(agent);
app.use(persistentTextStreaming);

export default app;
