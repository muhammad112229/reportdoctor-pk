import { createClient } from "@supabase/supabase-js";

const EXPECTED_SUPABASE_HOST = "epmdzpsbzhprhlhohhs.supabase.co";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  }
);

export function requireSupabaseConfig() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase public config missing.");
  }
}

export function getSupabaseDiagnostics() {
  const urlHost = getSupabaseUrlHost();
  return {
    urlConfigured: Boolean(supabaseUrl),
    anonKeyConfigured: Boolean(supabaseAnonKey),
    urlHost,
    urlHostMatchesExpected: urlHost === EXPECTED_SUPABASE_HOST,
    anonKeyPrefixValid: hasValidPublicKeyShape(supabaseAnonKey),
    expectedHost: EXPECTED_SUPABASE_HOST
  };
}

export function logSafeSupabaseDiagnostics(context: string) {
  const diagnostics = getSupabaseDiagnostics();
  console.info(`[ReportDoctor auth] ${context}`, {
    supabaseUrlConfigured: diagnostics.urlConfigured,
    supabaseUrlHost: diagnostics.urlHostMatchesExpected ? diagnostics.expectedHost : "wrong/missing",
    supabaseAnonKeyConfigured: diagnostics.anonKeyConfigured,
    supabaseAnonKeyPrefixValid: diagnostics.anonKeyPrefixValid
  });
}

export function getSafeAuthErrorMessage(caught: unknown, action: "signup" | "signin" | "session") {
  if (!isSupabaseConfigured) {
    return "Supabase public config missing.";
  }

  if (caught instanceof TypeError) {
    const base = action === "signup" ? "Signup service is not reachable" : "Signin service is not reachable";
    return `${base}. Please check Supabase configuration. (${caught.message})`;
  }

  if (caught instanceof Error) {
    if (caught.message === "Failed to fetch") {
      const base = action === "signup" ? "Signup service is not reachable" : "Signin service is not reachable";
      return `${base}. Please check Supabase configuration.`;
    }
    return caught.message;
  }

  return action === "signup"
    ? "Could not create your account. Please try again."
    : "Could not sign in. Please try again.";
}

function getSupabaseUrlHost() {
  if (!supabaseUrl) {
    return null;
  }

  try {
    return new URL(supabaseUrl).host;
  } catch {
    return null;
  }
}

function hasValidPublicKeyShape(value: string | undefined) {
  if (!value || value.length <= 20) {
    return false;
  }

  return value.startsWith("eyJ") || value.startsWith("sb_publishable_");
}
