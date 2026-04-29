import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91`;

interface RequestOptions {
  method?: string;
  body?: any;
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("token", token);
}

export function getCurrentUser(): any {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: any): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export const api = {
  auth: {
    sendOtp: (phone: string) =>
      request<{ success: boolean; otp?: string }>("/auth/send-otp", {
        method: "POST",
        body: { phone },
      }),

    verifyOtp: (phone: string, otp: string) =>
      request<{ success: boolean; token: string; user: any }>("/auth/verify-otp", {
        method: "POST",
        body: { phone, otp },
      }),

    me: (token: string) =>
      request<{ user: any }>("/auth/me", { token }),

    updateProfile: (token: string, updates: any) =>
      request<{ success: boolean; user: any }>("/auth/profile", {
        method: "PUT",
        body: updates,
        token,
      }),

    switchRole: (token: string, role: string) =>
      request<{ success: boolean; user: any }>("/auth/switch-role", {
        method: "POST",
        body: { role },
        token,
      }),
  },

  jobs: {
    create: (token: string, jobData: any) =>
      request<{ success: boolean; job: any }>("/jobs", {
        method: "POST",
        body: jobData,
        token,
      }),

    list: (params?: { type?: string; category?: string; status?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ jobs: any[] }>(`/jobs${query ? `?${query}` : ""}`);
    },

    get: (id: string) =>
      request<{ job: any }>(`/jobs/${id}`),

    apply: (token: string, jobId: string, quote: number, message: string) =>
      request<{ success: boolean; application: any }>(`/jobs/${jobId}/apply`, {
        method: "POST",
        body: { quote, message },
        token,
      }),

    acceptApplicant: (token: string, jobId: string, applicantId: string) =>
      request<{ success: boolean; job: any }>(`/jobs/${jobId}/accept/${applicantId}`, {
        method: "POST",
        token,
      }),

    complete: (token: string, jobId: string) =>
      request<{ success: boolean; job: any }>(`/jobs/${jobId}/complete`, {
        method: "POST",
        token,
      }),
  },

  payments: {
    create: (token: string, paymentData: { jobId: string; amount: number; method: string; reference?: string }) =>
      request<{ success: boolean; payment: any }>("/payments", {
        method: "POST",
        body: paymentData,
        token,
      }),
  },

  reviews: {
    submit: (token: string, reviewData: { jobId: string; targetUserId: string; rating: number; comment: string }) =>
      request<{ success: boolean; review: any }>("/reviews", {
        method: "POST",
        body: reviewData,
        token,
      }),
  },

  chat: {
    sendMessage: (token: string, jobId: string, text: string) =>
      request<{ success: boolean; message: any }>(`/chat/${jobId}/messages`, {
        method: "POST",
        body: { text },
        token,
      }),

    getMessages: (jobId: string) =>
      request<{ messages: any[] }>(`/chat/${jobId}/messages`),
  },

  disputes: {
    create: (token: string, disputeData: { jobId: string; reason: string; description: string }) =>
      request<{ success: boolean; dispute: any }>("/disputes", {
        method: "POST",
        body: disputeData,
        token,
      }),

    list: (token: string) =>
      request<{ disputes: any[] }>("/admin/disputes", { token }),
  },

  admin: {
    getStats: (token: string) =>
      request<{
        totalUsers: number;
        totalJobs: number;
        totalRevenue: number;
        activeJobs: number;
      }>("/admin/stats", { token }),

    getUsers: (token: string) =>
      request<{ users: any[] }>("/admin/users", { token }),
  },

  health: () =>
    request<{ status: string }>("/health"),
};
