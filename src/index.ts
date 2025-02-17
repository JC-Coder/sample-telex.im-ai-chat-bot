import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { config } from "dotenv";
import { AIService } from "./services/aiService";
import { TelexService } from "./services/telexService";
import { TelexWebhookPayload } from "./types";
import { telexGeneratedConfig } from "./data/integrationConfig";
import { cors } from "hono/cors";
import { InMemoryStorage } from "./services/storageService";

// Load environment variables
config();

const app = new Hono();

// Initialize services
const storage = new InMemoryStorage();
const telexService = new TelexService(storage);
const aiService = new AIService(process.env.GEMINI_API_KEY || "");

// Add queue implementation
const messageQueue: Array<{
  payload: TelexWebhookPayload;
}> = [];

// Worker function to process messages
const processQueue = async () => {
  console.log("processing queue, total messages : ", messageQueue?.length);
  while (messageQueue.length > 0) {
    const { payload } = messageQueue.shift()!;
    try {
      // Call AI with only the user provided message, ignoring previous context
      const answer: string = await aiService.getAnswer(payload.message, []);
      // Send the AI-generated answer to the channel
      await telexService.sendTelexResponse(payload.channel_id, answer);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }
};

// process queue
setInterval(() => {
  processQueue();
}, 1000);

// allow cors for all origin
app.use(
  "*",
  cors({
    origin: "*",
    maxAge: 600,
  })
);

// Schemas for request validation
const webhookSchema = z.object({
  channel_id: z
    .string()
    .optional()
    .default(process.env.CHANNEL_ID || ""),
  settings: z.array(
    z
      .object({
        label: z.string(),
        type: z.string(),
        description: z.string(),
        default: z.any(),
        required: z.boolean(),
      })
      .optional()
  ),
  message: z.string(),
});

// Webhook endpoint to receive messages
app.post("/webhook", zValidator("json", webhookSchema), async (c) => {
  const payload = c.req.valid("json") as TelexWebhookPayload;

  console.log("webhook incoming", payload);

  // Add to queue for background processing
  messageQueue.push({ payload });

  return c.json(
    {
      status: "success",
      message: payload?.message || "Message received",
    },
    200
  );
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "healthy" }, 200);
});

// get integration config
app.get("/integration-config", (c) => {
  return c.json(telexGeneratedConfig, 200);
});

// Start the server
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`Server is starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log("Server started");

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
