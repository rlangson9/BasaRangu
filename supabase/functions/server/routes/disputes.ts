import { Hono } from "npm:hono";
import { db, authenticate } from "../utils";

export const disputesRouter = new Hono();

disputesRouter.post("/", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    const user = await authenticate(token);
    const { jobId, reason, description } = await c.req.json();
    const dispute = await db.disputes.create({
      job_id: jobId,
      user_id: user.id,
      reason,
      description,
      status: "pending",
    });
    await db.jobs.update(jobId, {
      dispute_id: dispute.id,
      status: "disputed",
    });
    return c.json({ success: true, dispute });
  } catch (error) {
    console.error("Error creating dispute:", error);
    return c.json({ error: "Failed to create dispute" }, 500);
  }
});

disputesRouter.get("/", async (c) => {
  try {
    const disputes = await db.disputes.getAll();
    return c.json({ disputes });
  } catch (error) {
    console.error("Error getting disputes:", error);
    return c.json({ error: "Failed to get disputes" }, 500);
  }
});

disputesRouter.post("/:id/resolve", async (c) => {
  try {
    const disputeId = c.req.param("id");
    const { resolution, refundAmount } = await c.req.json();
    const dispute = await db.disputes.update(disputeId, {
      status: "resolved",
      resolution,
      resolved_at: new Date().toISOString(),
    });
    if (dispute) {
      await db.jobs.update(dispute.job_id, {
        status: "resolved",
      });
      if (refundAmount) {
        const job = await db.jobs.getById(dispute.job_id);
        if (job?.payment_id) {
          await db.payments.update(job.payment_id, {
            status: "refunded",
            refund_amount: refundAmount,
          });
        }
      }
    }
    return c.json({ success: true, dispute });
  } catch (error) {
    console.error("Error resolving dispute:", error);
    return c.json({ error: "Failed to resolve dispute" }, 500);
  }
});
