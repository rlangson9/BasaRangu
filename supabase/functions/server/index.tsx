import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const supabase = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const kv = {
  set: async (key: string, value: any): Promise<void> => {
    const sb = supabase();
    const { error } = await sb.from("kv_store_5ed51d91").upsert({ key, value });
    if (error) throw new Error(error.message);
  },
  get: async (key: string): Promise<any> => {
    const sb = supabase();
    const { data, error } = await sb.from("kv_store_5ed51d91").select("value").eq("key", key).maybeSingle();
    if (error) throw new Error(error.message);
    return data?.value;
  },
  del: async (key: string): Promise<void> => {
    const sb = supabase();
    const { error } = await sb.from("kv_store_5ed51d91").delete().eq("key", key);
    if (error) throw new Error(error.message);
  },
  getByPrefix: async (prefix: string): Promise<any[]> => {
    const sb = supabase();
    const { data, error } = await sb.from("kv_store_5ed51d91").select("key, value").like("key", prefix + "%");
    if (error) throw new Error(error.message);
    return data?.map((d: any) => d.value) ?? [];
  },
};

const app = new Hono();

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ==================== AUTHENTICATION ====================

app.post("/make-server-5ed51d91/auth/send-otp", async (c) => {
  try {
    const { phone } = await c.req.json();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await kv.set(`otp:${phone}`, JSON.stringify({ otp, expires: Date.now() + 300000 }));
    console.log(`OTP for ${phone}: ${otp}`);
    return c.json({ success: true, otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

app.post("/make-server-5ed51d91/auth/verify-otp", async (c) => {
  try {
    const { phone, otp } = await c.req.json();
    const otpData = await kv.get(`otp:${phone}`);
    if (!otpData) return c.json({ error: "Invalid or expired OTP" }, 400);
    const { otp: storedOtp, expires } = JSON.parse(otpData);
    if (Date.now() > expires || otp !== storedOtp) return c.json({ error: "Invalid or expired OTP" }, 400);
    let user = await kv.get(`user:${phone}`);
    if (!user) {
      const newUser = {
        phone,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        roles: ["user"],
        activeRole: "user",
        name: "",
        avatar: "",
        verified: false,
        wallet: 0,
        rating: 0,
        reviewCount: 0
      };
      await kv.set(`user:${phone}`, JSON.stringify(newUser));
      await kv.set(`userById:${newUser.id}`, JSON.stringify(newUser));
      user = JSON.stringify(newUser);
    }
    await kv.del(`otp:${phone}`);
    const token = btoa(`${phone}:${Date.now()}`);
    await kv.set(`token:${token}`, phone);
    return c.json({ success: true, token, user: JSON.parse(user) });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return c.json({ error: "Failed to verify OTP" }, 500);
  }
});

app.get("/make-server-5ed51d91/auth/me", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    if (!phone) return c.json({ error: "Invalid token" }, 401);
    const user = await kv.get(`user:${phone}`);
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json({ user: JSON.parse(user) });
  } catch (error) {
    console.error("Error getting user:", error);
    return c.json({ error: "Failed to get user" }, 500);
  }
});

app.put("/make-server-5ed51d91/auth/profile", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    if (!phone) return c.json({ error: "Invalid token" }, 401);
    const user = JSON.parse(await kv.get(`user:${phone}`) || "{}");
    const updates = await c.req.json();
    const updatedUser = { ...user, ...updates, phone };
    await kv.set(`user:${phone}`, JSON.stringify(updatedUser));
    await kv.set(`userById:${user.id}`, JSON.stringify(updatedUser));
    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

app.post("/make-server-5ed51d91/auth/switch-role", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    if (!phone) return c.json({ error: "Invalid token" }, 401);
    const user = JSON.parse(await kv.get(`user:${phone}`) || "{}");
    const { role } = await c.req.json();
    if (!user.roles.includes(role)) user.roles.push(role);
    user.activeRole = role;
    await kv.set(`user:${phone}`, JSON.stringify(user));
    await kv.set(`userById:${user.id}`, JSON.stringify(user));
    return c.json({ success: true, user });
  } catch (error) {
    console.error("Error switching role:", error);
    return c.json({ error: "Failed to switch role" }, 500);
  }
});

// ==================== JOBS & ERRANDS ====================

app.post("/make-server-5ed51d91/jobs", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    const user = JSON.parse(await kv.get(`user:${phone}`) || "{}");
    const jobData = await c.req.json();
    const job = {
      id: crypto.randomUUID(),
      ...jobData,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      createdAt: Date.now(),
      status: "open",
      applicants: [],
      messages: []
    };
    await kv.set(`job:${job.id}`, JSON.stringify(job));
    const userJobs = JSON.parse(await kv.get(`userJobs:${user.id}`) || "[]");
    userJobs.unshift(job.id);
    await kv.set(`userJobs:${user.id}`, JSON.stringify(userJobs));
    return c.json({ success: true, job });
  } catch (error) {
    console.error("Error creating job:", error);
    return c.json({ error: "Failed to create job" }, 500);
  }
});

app.get("/make-server-5ed51d91/jobs", async (c) => {
  try {
    const type = c.req.query("type");
    const category = c.req.query("category");
    const status = c.req.query("status") || "open";
    const allKeys = await kv.getByPrefix("job:");
    const jobs = allKeys.map(item => JSON.parse(item)).filter((job: any) => {
      if (type && job.type !== type) return false;
      if (category && job.category !== category) return false;
      if (status && job.status !== status) return false;
      return true;
    });
    jobs.sort((a: any, b: any) => b.createdAt - a.createdAt);
    return c.json({ jobs });
  } catch (error) {
    console.error("Error getting jobs:", error);
    return c.json({ error: "Failed to get jobs" }, 500);
  }
});

app.get("/make-server-5ed51d91/jobs/:id", async (c) => {
  try {
    const jobId = c.req.param("id");
    const job = await kv.get(`job:${jobId}`);
    if (!job) return c.json({ error: "Job not found" }, 404);
    return c.json({ job: JSON.parse(job) });
  } catch (error) {
    console.error("Error getting job:", error);
    return c.json({ error: "Failed to get job" }, 500);
  }
});

app.post("/make-server-5ed51d91/jobs/:id/apply", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    const user = JSON.parse(await kv.get(`user:${phone}`) || "{}");
    const jobId = c.req.param("id");
    const { quote, message } = await c.req.json();
    const job = JSON.parse(await kv.get(`job:${jobId}`) || "{}");
    const application = {
      id: crypto.randomUUID(),
      jobId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRating: user.rating,
      quote,
      message,
      createdAt: Date.now(),
      status: "pending"
    };
    job.applicants = job.applicants || [];
    job.applicants.push(application);
    await kv.set(`job:${jobId}`, JSON.stringify(job));
    await kv.set(`application:${application.id}`, JSON.stringify(application));
    return c.json({ success: true, application });
  } catch (error) {
    console.error("Error applying to job:", error);
    return c.json({ error: "Failed to apply to job" }, 500);
  }
});

app.post("/make-server-5ed51d91/jobs/:id/accept/:applicantId", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const jobId = c.req.param("id");
    const applicantId = c.req.param("applicantId");
    const job = JSON.parse(await kv.get(`job:${jobId}`) || "{}");
    job.status = "in_progress";
    job.acceptedApplicant = applicantId;
    await kv.set(`job:${jobId}`, JSON.stringify(job));
    return c.json({ success: true, job });
  } catch (error) {
    console.error("Error accepting applicant:", error);
    return c.json({ error: "Failed to accept applicant" }, 500);
  }
});

// ==================== PAYMENT & ESCROW ====================

app.post("/make-server-5ed51d91/payments", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    const user = JSON.parse(await kv.get(`user:${phone}`) || "{}");
    const { jobId, amount, method, reference } = await c.req.json();
    const payment = {
      id: crypto.randomUUID(),
      jobId,
      userId: user.id,
      amount,
      method,
      reference,
      status: method === "pesepay" ? "pending" : "escrow",
      createdAt: Date.now()
    };
    await kv.set(`payment:${payment.id}`, JSON.stringify(payment));
    const job = JSON.parse(await kv.get(`job:${jobId}`) || "{}");
    job.paymentId = payment.id;
    job.status = method === "pesepay" ? "payment_pending" : "paid";
    await kv.set(`job:${jobId}`, JSON.stringify(job));
    return c.json({ success: true, payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    return c.json({ error: "Failed to create payment" }, 500);
  }
});

app.post("/make-server-5ed51d91/jobs/:id/complete", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const jobId = c.req.param("id");
    const job = JSON.parse(await kv.get(`job:${jobId}`) || "{}");
    job.status = "completed";
    job.completedAt = Date.now();
    await kv.set(`job:${jobId}`, JSON.stringify(job));
    if (job.paymentId) {
      const payment = JSON.parse(await kv.get(`payment:${job.paymentId}`) || "{}");
      payment.status = "released";
      payment.releasedAt = Date.now();
      const commission = payment.amount * 0.15;
      const providerAmount = payment.amount - commission;
      payment.commission = commission;
      payment.providerAmount = providerAmount;
      await kv.set(`payment:${payment.id}`, JSON.stringify(payment));
      const applicant = job.applicants.find((a: any) => a.id === job.acceptedApplicant);
      if (applicant) {
        const provider = JSON.parse(await kv.get(`userById:${applicant.userId}`) || "{}");
        provider.wallet = (provider.wallet || 0) + providerAmount;
        await kv.set(`userById:${provider.id}`, JSON.stringify(provider));
        await kv.set(`user:${provider.phone}`, JSON.stringify(provider));
      }
    }
    return c.json({ success: true, job });
  } catch (error) {
    console.error("Error completing job:", error);
    return c.json({ error: "Failed to complete job" }, 500);
  }
});

// ==================== REVIEWS ====================

app.post("/make-server-5ed51d91/reviews", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    const user = JSON.parse(await kv.get(`user:${phone}`) || "{}");
    const { jobId, targetUserId, rating, comment } = await c.req.json();
    const review = {
      id: crypto.randomUUID(),
      jobId,
      fromUserId: user.id,
      fromUserName: user.name,
      targetUserId,
      rating,
      comment,
      createdAt: Date.now()
    };
    await kv.set(`review:${review.id}`, JSON.stringify(review));
    const targetUser = JSON.parse(await kv.get(`userById:${targetUserId}`) || "{}");
    const reviews = await kv.getByPrefix(`review:`);
    const userReviews = reviews.map((r: any) => JSON.parse(r)).filter((r: any) => r.targetUserId === targetUserId);
    const totalRating = userReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    targetUser.rating = totalRating / userReviews.length;
    targetUser.reviewCount = userReviews.length;
    await kv.set(`userById:${targetUser.id}`, JSON.stringify(targetUser));
    await kv.set(`user:${targetUser.phone}`, JSON.stringify(targetUser));
    return c.json({ success: true, review });
  } catch (error) {
    console.error("Error submitting review:", error);
    return c.json({ error: "Failed to submit review" }, 500);
  }
});

// ==================== CHAT ====================

app.post("/make-server-5ed51d91/chat/:jobId/messages", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    const user = JSON.parse(await kv.get(`user:${phone}`) || "{}");
    const jobId = c.req.param("jobId");
    const { text } = await c.req.json();
    const forbidden = ["whatsapp", "phone", "email", "@", ".com", "call me", "contact"];
    const hasForbidden = forbidden.some((word: string) => text.toLowerCase().includes(word));
    if (hasForbidden) return c.json({ error: "Message contains forbidden contact information" }, 400);
    const message = {
      id: crypto.randomUUID(),
      jobId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      createdAt: Date.now()
    };
    await kv.set(`message:${message.id}`, JSON.stringify(message));
    const job = JSON.parse(await kv.get(`job:${jobId}`) || "{}");
    job.messages = job.messages || [];
    job.messages.push(message.id);
    await kv.set(`job:${jobId}`, JSON.stringify(job));
    return c.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

app.get("/make-server-5ed51d91/chat/:jobId/messages", async (c) => {
  try {
    const jobId = c.req.param("jobId");
    const job = JSON.parse(await kv.get(`job:${jobId}`) || "{}");
    const messages = await Promise.all(
      (job.messages || []).map(async (msgId: string) => {
        const msg = await kv.get(`message:${msgId}`);
        return msg ? JSON.parse(msg) : null;
      })
    );
    return c.json({ messages: messages.filter(Boolean) });
  } catch (error) {
    console.error("Error getting messages:", error);
    return c.json({ error: "Failed to get messages" }, 500);
  }
});

// ==================== DISPUTES ====================

app.post("/make-server-5ed51d91/disputes", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const phone = await kv.get(`token:${token}`);
    const user = JSON.parse(await kv.get(`user:${phone}`) || "{}");
    const { jobId, reason, description } = await c.req.json();
    const dispute = {
      id: crypto.randomUUID(),
      jobId,
      userId: user.id,
      userName: user.name,
      reason,
      description,
      status: "pending",
      createdAt: Date.now(),
      resolvedAt: null,
      resolution: null
    };
    await kv.set(`dispute:${dispute.id}`, JSON.stringify(dispute));
    const job = JSON.parse(await kv.get(`job:${jobId}`) || "{}");
    job.disputeId = dispute.id;
    job.status = "disputed";
    await kv.set(`job:${jobId}`, JSON.stringify(job));
    return c.json({ success: true, dispute });
  } catch (error) {
    console.error("Error creating dispute:", error);
    return c.json({ error: "Failed to create dispute" }, 500);
  }
});

app.get("/make-server-5ed51d91/admin/disputes", async (c) => {
  try {
    const disputes = await kv.getByPrefix("dispute:");
    const parsedDisputes = disputes.map((d: any) => JSON.parse(d));
    return c.json({ disputes: parsedDisputes });
  } catch (error) {
    console.error("Error getting disputes:", error);
    return c.json({ error: "Failed to get disputes" }, 500);
  }
});

app.post("/make-server-5ed51d91/admin/disputes/:id/resolve", async (c) => {
  try {
    const disputeId = c.req.param("id");
    const { resolution, refundAmount } = await c.req.json();
    const dispute = JSON.parse(await kv.get(`dispute:${disputeId}`) || "{}");
    dispute.status = "resolved";
    dispute.resolution = resolution;
    dispute.resolvedAt = Date.now();
    await kv.set(`dispute:${disputeId}`, JSON.stringify(dispute));
    const job = JSON.parse(await kv.get(`job:${dispute.jobId}`) || "{}");
    job.status = "resolved";
    await kv.set(`job:${dispute.jobId}`, JSON.stringify(job));
    if (refundAmount && job.paymentId) {
      const payment = JSON.parse(await kv.get(`payment:${job.paymentId}`) || "{}");
      payment.status = "refunded";
      payment.refundAmount = refundAmount;
      await kv.set(`payment:${payment.id}`, JSON.stringify(payment));
    }
    return c.json({ success: true, dispute });
  } catch (error) {
    console.error("Error resolving dispute:", error);
    return c.json({ error: "Failed to resolve dispute" }, 500);
  }
});

// ==================== PESE PAY WEBHOOK ====================

app.post("/make-server-5ed51d91/pesepay/webhook", async (c) => {
  try {
    const webhookData = await c.req.json();
    console.log("Pesepay webhook received:", webhookData);
    const { reference, status } = webhookData;
    const payments = await kv.getByPrefix("payment:");
    const payment = payments.map((p: any) => JSON.parse(p)).find((p: any) => p.reference === reference);
    if (payment) {
      payment.status = status === "COMPLETED" ? "escrow" : "failed";
      payment.pesePayStatus = status;
      await kv.set(`payment:${payment.id}`, JSON.stringify(payment));
      if (status === "COMPLETED") {
        const job = JSON.parse(await kv.get(`job:${payment.jobId}`) || "{}");
        job.paymentId = payment.id;
        job.status = "paid";
        await kv.set(`job:${payment.jobId}`, JSON.stringify(job));
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

// ==================== ADMIN ====================

app.get("/make-server-5ed51d91/admin/stats", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    const jobs = await kv.getByPrefix("job:");
    const payments = await kv.getByPrefix("payment:");
    const totalUsers = users.length;
    const totalJobs = jobs.length;
    const totalRevenue = payments
      .map((p: any) => JSON.parse(p))
      .filter((p: any) => p.status === "released")
      .reduce((sum: number, p: any) => sum + (p.commission || 0), 0);
    return c.json({
      totalUsers,
      totalJobs,
      totalRevenue,
      activeJobs: jobs.filter((j: any) => JSON.parse(j).status === "in_progress").length
    });
  } catch (error) {
    console.error("Error getting admin stats:", error);
    return c.json({ error: "Failed to get stats" }, 500);
  }
});

app.get("/make-server-5ed51d91/admin/users", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    const parsedUsers = users.map((u: any) => JSON.parse(u));
    return c.json({ users: parsedUsers });
  } catch (error) {
    console.error("Error getting users:", error);
    return c.json({ error: "Failed to get users" }, 500);
  }
});

app.get("/make-server-5ed51d91/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);
