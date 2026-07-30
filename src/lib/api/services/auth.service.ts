import { apiFetch, USE_MOCK } from "@/lib/api/client";
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/lib/api/types";

const MOCK_USER: User = {
  id: 1,
  name: "Dinda Pratiwi",
  email: "dinda@example.com",
  phone: "08123456789",
  avatar: "https://i.pravatar.cc/100?img=47",
  role: "buyer",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  if (USE_MOCK) {
    if (payload.email === "demo@kantinpintar.id" && payload.password === "password") {
      return { user: MOCK_USER, token: "mock-token-123" };
    }
    throw new Error("Email atau password salah (demo: demo@kantinpintar.id / password)");
  }

  const response = await apiFetch<AuthResponse>("/login", { method: "POST", body: payload as Record<string, unknown> });
  if (!response.success) throw new Error(response.error.message);
  storeToken(response.data.token);
  return response.data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  if (USE_MOCK) {
    return {
      user: { ...MOCK_USER, name: payload.name, email: payload.email },
      token: "mock-token-register",
    };
  }

  const response = await apiFetch<AuthResponse>("/register", {
    method: "POST",
    body: payload as Record<string, unknown>,
  });
  if (!response.success) throw new Error(response.error.message);
  storeToken(response.data.token);
  return response.data;
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    clearToken();
    return;
  }

  await apiFetch("/logout", { method: "POST" });
  clearToken();
}

export async function getCurrentUser(): Promise<User | null> {
  if (USE_MOCK) {
    const token = getToken();
    return token ? MOCK_USER : null;
  }

  const response = await apiFetch<User>("/user");
  if (!response.success) {
    if (response.error.status === 401) return null;
    throw new Error(response.error.message);
  }
  return response.data;
}

export function storeToken(token: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("laravel_token", token);
  }
}

export function getToken(): string | null {
  return typeof localStorage !== "undefined" ? localStorage.getItem("laravel_token") : null;
}

export function clearToken(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("laravel_token");
  }
}
