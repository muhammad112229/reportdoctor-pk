"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export function AccountClient() {
  const router = useRouter();
  const { session, loading, profile, refreshAccountData } = useAuth();
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session) {
      router.replace("/signin?next=/account");
      return;
    }
    setFullName(profile?.full_name || "");
    setWhatsapp(profile?.whatsapp || "");
  }, [loading, profile, router, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      return;
    }

    setError(null);
    setStatus(null);
    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.from("profiles").upsert(
        {
          id: session.user.id,
          full_name: fullName.trim(),
          email: session.user.email || profile?.email || null,
          whatsapp: whatsapp.trim(),
          role: profile?.role || "user"
        },
        { onConflict: "id" }
      );
      if (updateError) {
        throw updateError;
      }
      await refreshAccountData();
      setStatus("Account updated.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update account.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="section">
        <div className="status-box">
          <Loader2 className="spin" size={18} aria-hidden="true" />
          Loading account...
        </div>
      </section>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Your profile</h1>
          <p>Keep your contact details updated so payment approvals and support messages go to the right place.</p>
        </div>
      </section>
      <section className="section">
        <div className="auth-card">
          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="full-name">Full name</label>
              <input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" value={session.user.email || ""} disabled readOnly />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp number</label>
              <input id="whatsapp" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} required />
            </div>
            {status ? <div className="status-box">{status}</div> : null}
            {error ? <div className="status-box error">{error}</div> : null}
            <button className="button primary" type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
              {submitting ? "Saving" : "Save profile"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
