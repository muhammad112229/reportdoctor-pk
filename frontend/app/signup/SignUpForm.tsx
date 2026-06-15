"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getSafeAuthErrorMessage, logSafeSupabaseDiagnostics, requireSupabaseConfig, supabase } from "@/lib/supabase";

export function SignUpForm() {
  const router = useRouter();
  const { refreshAccountData } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setSubmitting(true);

    try {
      requireSupabaseConfig();
      logSafeSupabaseDiagnostics("signup:start");
      const cleanEmail = email.trim();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            whatsapp: whatsapp.trim()
          }
        }
      });
      if (signUpError) {
        throw signUpError;
      }
      logSafeSupabaseDiagnostics("signup:auth-success");

      if (data.user && data.session) {
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            full_name: fullName.trim(),
            email: cleanEmail,
            whatsapp: whatsapp.trim(),
            role: "user"
          },
          { onConflict: "id" }
        );
        if (profileError) {
          setError(`Account created, but profile setup failed: ${profileError.message}`);
          return;
        }
        await refreshAccountData(data.session);
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setStatus("Account created. Please confirm your email, then sign in.");
    } catch (caught) {
      logSafeSupabaseDiagnostics("signup:error");
      setError(getSafeAuthErrorMessage(caught, "signup"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Create account</p>
        <h1>Sign up</h1>
        <p className="muted">Create your profile so approved payments can activate report credits automatically.</p>
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="full-name">Full name</label>
            <input
              id="full-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>
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
            <label htmlFor="whatsapp">WhatsApp number</label>
            <input
              id="whatsapp"
              type="tel"
              autoComplete="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="03XXXXXXXXX"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {status ? <div className="status-box">{status}</div> : null}
          {error ? <div className="status-box error">{error}</div> : null}
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
            {submitting ? "Creating account" : "Create account"}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link href="/signin">Sign in</Link>.
        </p>
      </div>
    </section>
  );
}
