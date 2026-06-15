import type { Session } from "@supabase/supabase-js";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export function isApiConfigured() {
  return Boolean(API_BASE);
}

export function apiUrl(path: string) {
  if (!API_BASE) {
    throw new Error("The ReportDoctor API URL is not configured. Add NEXT_PUBLIC_API_URL.");
  }
  return `${API_BASE}${path}`;
}

export async function fetchJson<T>(path: string, session: Session | null, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    headers
  });
  const text = await response.text();
  const data = text ? safeJson(text) : null;

  if (!response.ok) {
    const detail = data && typeof data === "object" && "detail" in data ? String(data.detail) : "Request failed.";
    const error = new Error(detail) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
