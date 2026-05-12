import { Hono } from "npm:hono";
import { db, authenticate } from "../utils";

export const chatRouter = new Hono();

chatRouter.post("/:jobId/messages", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    const user = await authenticate(token);
    const jobId = c.req.param("jobId");
    const { text } = await c.req.json();
    const forbidden = ["whatsapp", "phone", "email", "@", ".com", "call me", "contact"];
    const hasForbidden = forbidden.some((word: string) => text.toLowerCase().includes(word));
    if (hasForbidden) return c.json({ error: "Message contains forbidden contact information" }, 400);
    const message = await db.messages.create({
      job_id: jobId,
      user_id: user.id,
      text,
    });
    return c.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

chatRouter.get("/:jobId/messages", async (c) => {
  try {
    const jobId = c.req.param("jobId");
    const messages = await db.messages.getByJobId(jobId);
    return c.json({ messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    return c.json({ error: "Failed to get messages" }, 500);
  }
});
