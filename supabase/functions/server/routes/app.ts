import { Hono } from "npm:hono";
import { db, kv } from "../utils";

export const appRouter = new Hono();

appRouter.get("/settings", async (c) => {
  try {
    const settings = await kv.get("app:settings");
    const defaultSettings = {
      appName: "BasaRangu",
      appTagline: "Home Services & Job Recruitment Platform",
      logoUrl: "/basarangu.png",
    };
    return c.json({ settings: settings || defaultSettings });
  } catch (error) {
    console.error("Error getting app settings:", error);
    return c.json({ error: "Failed to get settings" }, 500);
  }
});

appRouter.put("/settings", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    const user = await db.users.getByPhone(phone);
    const settings = await c.req.json();
    await kv.set("app:settings", settings);
    return c.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating app settings:", error);
    return c.json({ error: "Failed to update settings" }, 500);
  }
});
