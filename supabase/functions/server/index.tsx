import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

import { authRouter } from "./routes/auth";
import { jobsRouter } from "./routes/jobs";
import { paymentsRouter } from "./routes/payments";
import { chatRouter } from "./routes/chat";
import { reviewsRouter } from "./routes/reviews";
import { disputesRouter } from "./routes/disputes";
import { adminRouter } from "./routes/admin";
import { appRouter } from "./routes/app";

const app = new Hono();

const isProduction = Deno.env.get("NODE_ENV") === "production";
const allowedOrigins = isProduction 
  ? ["https://yourdomain.com", "https://www.yourdomain.com"]
  : ["http://localhost:5173", "http://192.168.0.104:5173"];

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: isProduction ? allowedOrigins : "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.route("/make-server-5ed51d91/auth", authRouter);
app.route("/make-server-5ed51d91/jobs", jobsRouter);
app.route("/make-server-5ed51d91/payments", paymentsRouter);
app.route("/make-server-5ed51d91/chat", chatRouter);
app.route("/make-server-5ed51d91/reviews", reviewsRouter);
app.route("/make-server-5ed51d91/disputes", disputesRouter);
app.route("/make-server-5ed51d91/admin", adminRouter);
app.route("/make-server-5ed51d91/app", appRouter);

app.get("/make-server-5ed51d91/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);
