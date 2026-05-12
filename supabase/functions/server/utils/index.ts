import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { sign, verify } from "jsr:@djwt/core";
import { HS256 } from "jsr:@djwt/signature";

const supabase = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "basarangu-secret-key-change-in-production";
const JWT_EXPIRES_IN = 86400;

export type User = {
  id: string;
  phone: string;
  name: string;
  avatar: string;
  email?: string;
  address?: string;
  city?: string;
  roles: string[];
  active_role: string;
  verified: boolean;
  wallet: number;
  rating: number;
  review_count: number;
  id_verified: boolean;
  id_document_url?: string;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  budget?: number;
  urgency: string;
  status: string;
  accepted_applicant_id?: string;
  payment_id?: string;
  dispute_id?: string;
  created_at: string;
  completed_at?: string;
};

export type Application = {
  id: string;
  job_id: string;
  user_id: string;
  quote?: number;
  message?: string;
  status: string;
  created_at: string;
};

export type Payment = {
  id: string;
  job_id: string;
  user_id: string;
  amount: number;
  commission?: number;
  provider_amount?: number;
  method: string;
  reference?: string;
  status: string;
  refund_amount?: number;
  created_at: string;
  released_at?: string;
};

export type Review = {
  id: string;
  job_id: string;
  from_user_id: string;
  target_user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
};

export type Message = {
  id: string;
  job_id: string;
  user_id: string;
  text: string;
  created_at: string;
};

export type Dispute = {
  id: string;
  job_id: string;
  user_id: string;
  reason: string;
  description?: string;
  status: string;
  resolution?: string;
  created_at: string;
  resolved_at?: string;
};

export const db = {
  users: {
    getById: async (id: string): Promise<User | null> => {
      const { data, error } = await supabase().from("users").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    getByPhone: async (phone: string): Promise<User | null> => {
      const { data, error } = await supabase().from("users").select("*").eq("phone", phone).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    create: async (user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> => {
      const { data, error } = await supabase().from("users").insert(user).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    update: async (id: string, updates: Partial<User>): Promise<User | null> => {
      const { data, error } = await supabase().from("users").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    getAll: async (): Promise<User[]> => {
      const { data, error } = await supabase().from("users").select("*");
      if (error) throw new Error(error.message);
      return data || [];
    },
  },
  jobs: {
    create: async (job: Omit<Job, "id" | "created_at">): Promise<Job> => {
      const { data, error } = await supabase().from("jobs").insert(job).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    getAll: async (filters?: { type?: string; category?: string; status?: string }): Promise<Job[]> => {
      let query = supabase().from("jobs").select("*");
      if (filters?.type) query = query.eq("type", filters.type);
      if (filters?.category) query = query.eq("category", filters.category);
      if (filters?.status) query = query.eq("status", filters.status);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
    getById: async (id: string): Promise<Job | null> => {
      const { data, error } = await supabase().from("jobs").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    update: async (id: string, updates: Partial<Job>): Promise<Job | null> => {
      const { data, error } = await supabase().from("jobs").update(updates).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    count: async (status?: string): Promise<number> => {
      let query = supabase().from("jobs").select("id", { count: "exact" });
      if (status) query = query.eq("status", status);
      const { count, error } = await query;
      if (error) throw new Error(error.message);
      return count || 0;
    },
  },
  applications: {
    create: async (application: Omit<Application, "id" | "created_at">): Promise<Application> => {
      const { data, error } = await supabase().from("applications").insert(application).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    getByJobId: async (jobId: string): Promise<Application[]> => {
      const { data, error } = await supabase().from("applications").select("*").eq("job_id", jobId);
      if (error) throw new Error(error.message);
      return data || [];
    },
    getByUserId: async (userId: string): Promise<Application[]> => {
      const { data, error } = await supabase().from("applications").select("*").eq("user_id", userId);
      if (error) throw new Error(error.message);
      return data || [];
    },
  },
  payments: {
    create: async (payment: Omit<Payment, "id" | "created_at">): Promise<Payment> => {
      const { data, error } = await supabase().from("payments").insert(payment).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    getById: async (id: string): Promise<Payment | null> => {
      const { data, error } = await supabase().from("payments").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    getByReference: async (reference: string): Promise<Payment | null> => {
      const { data, error } = await supabase().from("payments").select("*").eq("reference", reference).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    update: async (id: string, updates: Partial<Payment>): Promise<Payment | null> => {
      const { data, error } = await supabase().from("payments").update(updates).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    getAll: async (): Promise<Payment[]> => {
      const { data, error } = await supabase().from("payments").select("*");
      if (error) throw new Error(error.message);
      return data || [];
    },
    sumCommission: async (): Promise<number> => {
      const { data, error } = await supabase().from("payments").select("commission").eq("status", "released");
      if (error) throw new Error(error.message);
      return (data || []).reduce((sum: number, p: any) => sum + (p.commission || 0), 0);
    },
  },
  reviews: {
    create: async (review: Omit<Review, "id" | "created_at">): Promise<Review> => {
      const { data, error } = await supabase().from("reviews").insert(review).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    getByTargetUserId: async (userId: string): Promise<Review[]> => {
      const { data, error } = await supabase().from("reviews").select("*").eq("target_user_id", userId);
      if (error) throw new Error(error.message);
      return data || [];
    },
  },
  messages: {
    create: async (message: Omit<Message, "id" | "created_at">): Promise<Message> => {
      const { data, error } = await supabase().from("messages").insert(message).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    getByJobId: async (jobId: string): Promise<Message[]> => {
      const { data, error } = await supabase().from("messages").select("*").eq("job_id", jobId).order("created_at");
      if (error) throw new Error(error.message);
      return data || [];
    },
  },
  disputes: {
    create: async (dispute: Omit<Dispute, "id" | "created_at">): Promise<Dispute> => {
      const { data, error } = await supabase().from("disputes").insert(dispute).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    getAll: async (): Promise<Dispute[]> => {
      const { data, error } = await supabase().from("disputes").select("*");
      if (error) throw new Error(error.message);
      return data || [];
    },
    getById: async (id: string): Promise<Dispute | null> => {
      const { data, error } = await supabase().from("disputes").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    update: async (id: string, updates: Partial<Dispute>): Promise<Dispute | null> => {
      const { data, error } = await supabase().from("disputes").update(updates).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
  },
};

export const kv = {
  set: async (key: string, value: any, expiresAt?: Date): Promise<void> => {
    const { error } = await supabase().from("kv_store").upsert({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
      expires_at: expiresAt?.toISOString(),
    });
    if (error) throw new Error(error.message);
  },
  get: async (key: string): Promise<any> => {
    const { data, error } = await supabase().from("kv_store").select("value").eq("key", key).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    try {
      return JSON.parse(data.value);
    } catch {
      return data.value;
    }
  },
  del: async (key: string): Promise<void> => {
    const { error } = await supabase().from("kv_store").delete().eq("key", key);
    if (error) throw new Error(error.message);
  },
};

export const generateToken = async (userId: string, phone: string): Promise<string> => {
  const payload = {
    sub: userId,
    phone,
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN,
    iat: Math.floor(Date.now() / 1000),
  };
  return await sign({ payload, key: JWT_SECRET, algorithm: HS256 });
};

export const verifyToken = async (token: string): Promise<{ sub: string; phone: string }> => {
  try {
    const verified = await verify(token, { key: JWT_SECRET, algorithm: HS256 });
    return verified.payload as { sub: string; phone: string };
  } catch {
    throw new Error("Invalid token");
  }
};

export const authenticate = async (token: string | undefined): Promise<User> => {
  if (!token) throw new Error("Unauthorized");
  const tokenWithoutBearer = token.replace("Bearer ", "");
  const payload = await verifyToken(tokenWithoutBearer);
  const user = await db.users.getByPhone(payload.phone);
  if (!user) throw new Error("User not found");
  return user;
};

export const authorize = async (token: string | undefined, requiredRole: string): Promise<User> => {
  const user = await authenticate(token);
  if (!user.roles.includes(requiredRole)) {
    throw new Error("Forbidden: Insufficient permissions");
  }
  return user;
};

export const validateInput = (input: Record<string, any>, schema: Record<string, { type: string; required?: boolean; min?: number; max?: number; pattern?: RegExp }>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = input[field];
    
    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (value === undefined || value === null) continue;
    
    switch (rules.type) {
      case "string":
        if (typeof value !== "string") {
          errors.push(`${field} must be a string`);
        } else if (rules.min && value.length < rules.min) {
          errors.push(`${field} must be at least ${rules.min} characters`);
        } else if (rules.max && value.length > rules.max) {
          errors.push(`${field} must be at most ${rules.max} characters`);
        } else if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} is invalid`);
        }
        break;
      case "number":
        if (typeof value !== "number" || isNaN(value)) {
          errors.push(`${field} must be a number`);
        } else if (rules.min && value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        } else if (rules.max && value > rules.max) {
          errors.push(`${field} must be at most ${rules.max}`);
        }
        break;
      case "array":
        if (!Array.isArray(value)) {
          errors.push(`${field} must be an array`);
        } else if (rules.min && value.length < rules.min) {
          errors.push(`${field} must have at least ${rules.min} items`);
        }
        break;
      case "boolean":
        if (typeof value !== "boolean") {
          errors.push(`${field} must be a boolean`);
        }
        break;
    }
  }
  
  return { valid: errors.length === 0, errors };
};
