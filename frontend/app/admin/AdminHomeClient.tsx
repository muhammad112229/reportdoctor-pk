"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AdminGate } from "./AdminGate";
import { useAuth } from "@/components/AuthProvider";
import { fetchJson } from "@/lib/api";

type AdminSummary = {
  orders_total: number;
  pending_orders: number;
  users_total: number;
  reports_total: number;
};

export function AdminHomeClient() {
  const { session } = useAuth();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }
    fetchJson<AdminSummary>("/admin/summary", session)
      .then(setSummary)
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load admin dashboard."));
  }, [session]);

  return (
    <AdminGate>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Operations dashboard</h1>
          <p>Approve orders, review users, and audit generated report activity.</p>
        </div>
      </section>
      <section className="section dashboard-stack">
        {error ? <div className="status-box error">{error}</div> : null}
        {!summary && !error ? (
          <div className="status-box">
            <Loader2 className="spin" size={18} aria-hidden="true" />
            Loading admin stats...
          </div>
        ) : null}
        <div className="metric-grid">
          <div className="metric"><span>Total orders</span><strong>{summary?.orders_total ?? 0}</strong></div>
          <div className="metric"><span>Pending orders</span><strong>{summary?.pending_orders ?? 0}</strong></div>
          <div className="metric"><span>Users</span><strong>{summary?.users_total ?? 0}</strong></div>
          <div className="metric"><span>Reports</span><strong>{summary?.reports_total ?? 0}</strong></div>
        </div>
        <div className="card-grid">
          <Link className="tool-card" href="/admin/orders"><h3>Orders</h3><p>Approve or reject Easypaisa payment requests.</p></Link>
          <Link className="tool-card" href="/admin/users"><h3>Users</h3><p>Review profiles, roles, and credit balances.</p></Link>
          <Link className="tool-card" href="/admin/reports"><h3>Reports</h3><p>Audit recent paid PDF unlocks.</p></Link>
        </div>
      </section>
    </AdminGate>
  );
}
