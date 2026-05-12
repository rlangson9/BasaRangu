import { Hono } from "npm:hono";
import { db, authorize } from "../utils";

export const adminRouter = new Hono();

adminRouter.get("/stats", async (c) => {
  try {
    const token = c.req.header("Authorization");
    await authorize(token, "admin");
    
    const users = await db.users.getAll();
    const totalUsers = users.length;
    const totalJobs = await db.jobs.count();
    const activeJobs = await db.jobs.count("in_progress");
    const totalRevenue = await db.payments.sumCommission();
    
    return c.json({
      totalUsers,
      totalJobs,
      totalRevenue,
      activeJobs,
    });
  } catch (error) {
    console.error("Error getting admin stats:", error);
    return c.json({ error: (error as Error).message }, 401);
  }
});

adminRouter.get("/users", async (c) => {
  try {
    const token = c.req.header("Authorization");
    await authorize(token, "admin");
    
    const users = await db.users.getAll();
    return c.json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    return c.json({ error: (error as Error).message }, 401);
  }
});

adminRouter.get("/jobs", async (c) => {
  try {
    const token = c.req.header("Authorization");
    await authorize(token, "admin");
    
    const jobs = await db.jobs.getAll();
    return c.json({ jobs });
  } catch (error) {
    console.error("Error getting jobs:", error);
    return c.json({ error: (error as Error).message }, 401);
  }
});

adminRouter.get("/payments", async (c) => {
  try {
    const token = c.req.header("Authorization");
    await authorize(token, "admin");
    
    const payments = await db.payments.getAll();
    return c.json({ payments });
  } catch (error) {
    console.error("Error getting payments:", error);
    return c.json({ error: (error as Error).message }, 401);
  }
});

adminRouter.delete("/users/:id", async (c) => {
  try {
    const token = c.req.header("Authorization");
    await authorize(token, "admin");
    
    const userId = c.req.param("id");
    const user = await db.users.getById(userId);
    if (!user) return c.json({ error: "User not found" }, 404);
    
    await db.users.update(userId, { active_role: "deleted" });
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return c.json({ error: (error as Error).message }, 401);
  }
});
