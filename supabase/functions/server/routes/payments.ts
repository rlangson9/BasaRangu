import { Hono } from "npm:hono";
import { db, authenticate } from "../utils";

export const paymentsRouter = new Hono();

paymentsRouter.post("/", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    const user = await authenticate(token);
    const { jobId, amount, method, reference } = await c.req.json();
    const payment = await db.payments.create({
      job_id: jobId,
      user_id: user.id,
      amount,
      method,
      reference,
      status: method === "pesepay" ? "pending" : "escrow",
    });
    await db.jobs.update(jobId, {
      payment_id: payment.id,
      status: method === "pesepay" ? "payment_pending" : "paid",
    });
    return c.json({ success: true, payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    return c.json({ error: "Failed to create payment" }, 500);
  }
});

paymentsRouter.post("/pesepay/webhook", async (c) => {
  try {
    const webhookData = await c.req.json();
    console.log("Pesepay webhook received:", webhookData);
    const { reference, status } = webhookData;
    const payment = await db.payments.getByReference(reference);
    if (payment) {
      await db.payments.update(payment.id, {
        status: status === "COMPLETED" ? "escrow" : "failed",
        pese_pay_status: status,
      });
      if (status === "COMPLETED") {
        await db.jobs.update(payment.job_id, {
          status: "paid",
        });
      }
      return c.json({ success: true, message: "Webhook processed" });
    } else {
      return c.json({ error: "Payment not found" }, 404);
    }
  } catch (error) {
    console.error("Error processing pese Pay webhook:", error);
    return c.json({ error: "Failed to process webhook" }, 500);
  }
});
