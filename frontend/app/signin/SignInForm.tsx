"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { requireSupabaseConfig, supabase } from "@/lib/supabase";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, loading, refreshAccountData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nextPath = useMemo(() => safeNextPath(searchParams.get("next")) || "/dashboard", [searchParams]);

  useEffect(() => {
    if (!loading && session) {
      router.replace(nextPath);
    }
  }, [loading, nextPath, router, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setSubmitting(true);

    try {
      requireSupabaseConfig();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (signInError) {
        throw signInError;
      }
      await refreshAccountData(data.session);
      setStatus("Signed in successfully.");
      router.push(nextPath);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <p className="muted">Access your dashboard, orders, and report credits.</p>
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {status ? <div className="status-box">{status}</div> : null}
          {error ? <div className="status-box error">{error}</div> : null}
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
            {submitting ? "Signing in" : "Sign in"}
          </button>
        </form>
        <p className="muted">
          New to ReportDoctor.pk? <Link href="/signup">Create an account</Link>.
        </p>
      </div>
    </section>
  );
}

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
}
