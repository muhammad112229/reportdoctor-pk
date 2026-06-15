"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getSafeAuthErrorMessage, getSupabaseDiagnostics, logSafeSupabaseDiagnostics, supabase } from "@/lib/supabase";

type SessionStatus = {
  state: "loading" | "success" | "error";
  message: string;
};

export function AuthDebugClient() {
  const diagnostics = getSupabaseDiagnostics();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    state: "loading",
    message: "Checking Supabase auth session..."
  });

  useEffect(() => {
    let active = true;
    logSafeSupabaseDiagnostics("auth-debug:load");

    if (!diagnostics.urlConfigured || !diagnostics.anonKeyConfigured) {
      setSessionStatus({
        state: "error",
        message: "Supabase public config missing."
      });
      return;
    }

    supabase.auth
      .getSession()
      .then(({ error }) => {
        if (!active) {
          return;
        }
        if (error) {
          setSessionStatus({ state: "error", message: error.message });
          return;
        }
        setSessionStatus({ state: "success", message: "success" });
      })
      .catch((caught) => {
        if (!active) {
          return;
        }
        setSessionStatus({
          state: "error",
          message: getSafeAuthErrorMessage(caught, "session")
        });
      });

    return () => {
      active = false;
    };
  }, [diagnostics.anonKeyConfigured, diagnostics.urlConfigured]);

  const hostDisplay = diagnostics.urlHostMatchesExpected ? diagnostics.expectedHost : "wrong/missing";

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Auth debug</p>
        <h1>Supabase public config</h1>
        <div className="detail-list">
          <div>
            <span>Supabase URL configured</span>
            <strong>{yesNo(diagnostics.urlConfigured)}</strong>
          </div>
          <div>
            <span>Supabase URL host</span>
            <strong>{hostDisplay}</strong>
          </div>
          <div>
            <span>Supabase anon key configured</span>
            <strong>{yesNo(diagnostics.anonKeyConfigured)}</strong>
          </div>
          <div>
            <span>Supabase anon key prefix valid</span>
            <strong>{yesNo(diagnostics.anonKeyPrefixValid)}</strong>
          </div>
          <div>
            <span>Supabase auth getSession test</span>
            <strong>
              {sessionStatus.state === "loading" ? <Loader2 className="spin" size={18} aria-hidden="true" /> : null}
              {sessionStatus.message}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function yesNo(value: boolean) {
  return value ? "yes" : "no";
}
