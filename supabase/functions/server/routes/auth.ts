import { Hono } from "npm:hono";
import { db, kv, authenticate, authorize, generateToken, validateInput } from "../utils";

export const authRouter = new Hono();

authRouter.post("/send-otp", async (c) => {
  try {
    const body = await c.req.json();
    const validation = validateInput(body, {
      phone: { type: "string", required: true, pattern: /^\+?[1-9]\d{1,14}$/ },
    });
    if (!validation.valid) {
      return c.json({ error: validation.errors.join(", ") }, 400);
    }
    
    const { phone } = body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 300000);
    await kv.set(`otp:${phone}`, { otp, expires: Date.now() + 300000 }, expiresAt);
    
    if (Deno.env.get("NODE_ENV") === "development") {
      console.log(`OTP for ${phone}: ${otp}`);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

authRouter.post("/verify-otp", async (c) => {
  try {
    const body = await c.req.json();
    const validation = validateInput(body, {
      phone: { type: "string", required: true, pattern: /^\+?[1-9]\d{1,14}$/ },
      otp: { type: "string", required: true, pattern: /^\d{6}$/ },
    });
    if (!validation.valid) {
      return c.json({ error: validation.errors.join(", ") }, 400);
    }
    
    const { phone, otp } = body;
    const otpData = await kv.get(`otp:${phone}`);
    
    if (!otpData) return c.json({ error: "Invalid or expired OTP" }, 400);
    const { otp: storedOtp, expires } = otpData;
    
    if (Date.now() > expires || otp !== storedOtp) {
      return c.json({ error: "Invalid or expired OTP" }, 400);
    }
    
    let user = await db.users.getByPhone(phone);
    if (!user) {
      user = await db.users.create({
        phone,
        name: "",
        avatar: "",
        roles: ["user"],
        active_role: "user",
        verified: false,
        wallet: 0,
        rating: 0,
        review_count: 0,
        id_verified: false,
      });
    }
    
    await kv.del(`otp:${phone}`);
    const token = await generateToken(user.id, phone);
    
    return c.json({ success: true, token, user });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return c.json({ error: "Failed to verify OTP" }, 500);
  }
});

authRouter.get("/me", async (c) => {
  try {
    const token = c.req.header("Authorization");
    const user = await authenticate(token);
    return c.json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    return c.json({ error: (error as Error).message }, 401);
  }
});

authRouter.put("/profile", async (c) => {
  try {
    const token = c.req.header("Authorization");
    const user = await authenticate(token);
    const updates = await c.req.json();
    
    const validation = validateInput(updates, {
      name: { type: "string", max: 100 },
      email: { type: "string", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      address: { type: "string", max: 500 },
      city: { type: "string", max: 100 },
    });
    if (!validation.valid) {
      return c.json({ error: validation.errors.join(", ") }, 400);
    }
    
    const updatedUser = await db.users.update(user.id, updates);
    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

authRouter.post("/switch-role", async (c) => {
  try {
    const token = c.req.header("Authorization");
    const user = await authenticate(token);
    
    const body = await c.req.json();
    const validation = validateInput(body, {
      role: { type: "string", required: true, pattern: /^(user|provider|runner|recruiter)$/ },
    });
    if (!validation.valid) {
      return c.json({ error: validation.errors.join(", ") }, 400);
    }
    
    const { role } = body;
    const allowedRoles = ["user", "provider", "runner", "recruiter"];
    
    if (!allowedRoles.includes(role)) {
      return c.json({ error: "Invalid role" }, 400);
    }
    
    const roles = [...new Set([...user.roles, role])];
    const updatedUser = await db.users.update(user.id, { roles, active_role: role });
    
    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error switching role:", error);
    return c.json({ error: "Failed to switch role" }, 500);
  }
});

authRouter.post("/promote-admin", async (c) => {
  try {
    const token = c.req.header("Authorization");
    await authorize(token, "admin");
    
    const body = await c.req.json();
    const validation = validateInput(body, {
      userId: { type: "string", required: true },
    });
    if (!validation.valid) {
      return c.json({ error: validation.errors.join(", ") }, 400);
    }
    
    const { userId } = body;
    const user = await db.users.getById(userId);
    if (!user) return c.json({ error: "User not found" }, 404);
    
    const roles = [...new Set([...user.roles, "admin"])];
    const updatedUser = await db.users.update(userId, { roles });
    
    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error promoting admin:", error);
    return c.json({ error: (error as Error).message }, 401);
  }
});
