"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace(`/signin?next=${pathname}`);
    }
  }, [loading, pathname, router, session]);

  if (loading) {
    return (
      <section className="section">
        <div className="status-box">
          <Loader2 className="spin" size={18} aria-hidden="true" />
          Checking admin access...
        </div>
      </section>
    );
  }

  if (!session) {
    return null;
  }

  if (profile?.role !== "admin") {
    return (
      <section className="section">
        <div className="result-panel">
          <p className="eyebrow">Unauthorized</p>
          <h1>Admin access required</h1>
          <p className="muted">This area is only available to ReportDoctor.pk admins.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/dashboard">Back to dashboard</Link>
            <span className="status-box error">
              <ShieldAlert size={18} aria-hidden="true" />
              Your account role is {profile?.role || "user"}.
            </span>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
