import { Hono } from "npm:hono";
import { db, authenticate } from "../utils";

export const jobsRouter = new Hono();

jobsRouter.post("/", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    const user = await authenticate(token);
    const jobData = await c.req.json();
    const job = await db.jobs.create({
      user_id: user.id,
      title: jobData.title,
      description: jobData.description,
      category: jobData.category,
      type: jobData.type || "errand",
      location: jobData.location,
      budget: jobData.budget,
      urgency: jobData.urgency || "normal",
      status: "open",
    });
    return c.json({ success: true, job });
  } catch (error) {
    console.error("Error creating job:", error);
    return c.json({ error: "Failed to create job" }, 500);
  }
});

jobsRouter.get("/", async (c) => {
  try {
    const type = c.req.query("type");
    const category = c.req.query("category");
    const status = c.req.query("status") || "open";
    const jobs = await db.jobs.getAll({ type, category, status });
    return c.json({ jobs });
  } catch (error) {
    console.error("Error getting jobs:", error);
    return c.json({ error: "Failed to get jobs" }, 500);
  }
});

jobsRouter.get("/:id", async (c) => {
  try {
    const jobId = c.req.param("id");
    const job = await db.jobs.getById(jobId);
    if (!job) return c.json({ error: "Job not found" }, 404);
    const applications = await db.applications.getByJobId(jobId);
    return c.json({ job, applications });
  } catch (error) {
    console.error("Error getting job:", error);
    return c.json({ error: "Failed to get job" }, 500);
  }
});

jobsRouter.post("/:id/apply", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    const user = await authenticate(token);
    const jobId = c.req.param("id");
    const { quote, message } = await c.req.json();
    const application = await db.applications.create({
      job_id: jobId,
      user_id: user.id,
      quote,
      message,
      status: "pending",
    });
    return c.json({ success: true, application });
  } catch (error) {
    console.error("Error applying to job:", error);
    return c.json({ error: "Failed to apply to job" }, 500);
  }
});

jobsRouter.post("/:id/accept/:applicantId", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    await authenticate(token);
    const jobId = c.req.param("id");
    const applicantId = c.req.param("applicantId");
    const job = await db.jobs.update(jobId, {
      status: "in_progress",
      accepted_applicant_id: applicantId,
    });
    return c.json({ success: true, job });
  } catch (error) {
    console.error("Error accepting applicant:", error);
    return c.json({ error: "Failed to accept applicant" }, 500);
  }
});

jobsRouter.post("/:id/complete", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    await authenticate(token);
    const jobId = c.req.param("id");
    const job = await db.jobs.getById(jobId);
    if (!job) return c.json({ error: "Job not found" }, 404);
    await db.jobs.update(jobId, {
      status: "completed",
      completed_at: new Date().toISOString(),
    });
    if (job.payment_id) {
      const payment = await db.payments.getById(job.payment_id);
      if (payment) {
        const commission = payment.amount * 0.15;
        const providerAmount = payment.amount - commission;
        await db.payments.update(payment.id, {
          status: "released",
          released_at: new Date().toISOString(),
          commission,
          provider_amount: providerAmount,
        });
        if (job.accepted_applicant_id) {
          const applications = await db.applications.getByJobId(jobId);
          const applicant = applications.find((a: any) => a.id === job.accepted_applicant_id);
          if (applicant) {
            const provider = await db.users.getById(applicant.user_id);
            if (provider) {
              await db.users.update(provider.id, {
                wallet: (provider.wallet || 0) + providerAmount,
              });
            }
          }
        }
      }
    }
    return c.json({ success: true, job });
  } catch (error) {
    console.error("Error completing job:", error);
    return c.json({ error: "Failed to complete job" }, 500);
  }
});
