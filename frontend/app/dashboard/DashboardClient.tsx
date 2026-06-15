"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, MessageCircle, PlusCircle, ScanLine } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import type { AccountSummary } from "@/lib/accountTypes";
import { fetchJson } from "@/lib/api";
import { paymentOptions } from "@/lib/site";

export function DashboardClient() {
  const router = useRouter();
  const { session, loading, profile, refreshAccountData } = useAuth();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session) {
      router.replace("/signin?next=/dashboard");
      return;
    }

    setFetching(true);
    fetchJson<AccountSummary>("/account/summary", session)
      .then(async (data) => {
        setSummary(data);
        await refreshAccountData();
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load dashboard."))
      .finally(() => setFetching(false));
  }, [loading, refreshAccountData, router, session]);

  if (loading || fetching) {
    return (
      <section className="section">
        <div className="status-box">
          <Loader2 className="spin" size={18} aria-hidden="true" />
          Loading dashboard...
        </div>
      </section>
    );
  }

  if (!session) {
    return null;
  }

  const activeProfile = summary?.profile || profile;
  const pendingOrders = summary?.orders.filter((order) => order.status === "pending" || order.status === "sent_on_whatsapp") || [];
  const approvedOrders = summary?.orders.filter((order) => order.status === "approved") || [];
  const reports = summary?.reports || [];
  const availableCredits = summary?.available_credits ?? 0;
  const whatsappUrl = `https://wa.me/${paymentOptions.whatsapp}`;

  return (
    <>
      <section className="page-hero portal-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome{activeProfile?.full_name ? `, ${activeProfile.full_name}` : ""}</h1>
          <p>Track payment orders, report credits, and your recent PDF downloads.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/free-scan">
              <ScanLine size={18} aria-hidden="true" />
              Free Scan
            </Link>
            <Link className="button secondary" href="/pricing">
              <PlusCircle size={18} aria-hidden="true" />
              Buy More Reports
            </Link>
            <a className="button ghost" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>

      <section className="section portal-section dashboard-stack">
        {error ? <div className="status-box error">{error}</div> : null}
        <div className="metric-grid">
          <div className="metric">
            <span>Available report credits</span>
            <strong>{availableCredits}</strong>
          </div>
          <div className="metric">
            <span>Pending orders</span>
            <strong>{pendingOrders.length}</strong>
          </div>
          <div className="metric">
            <span>Approved orders</span>
            <strong>{approvedOrders.length}</strong>
          </div>
          <div className="metric">
            <span>Recent reports</span>
            <strong>{reports.length}</strong>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="result-panel">
            <p className="eyebrow">Profile</p>
            <h2>Account info</h2>
            <div className="detail-list">
              <div><span>Name</span><strong>{activeProfile?.full_name || "Not added"}</strong></div>
              <div><span>Email</span><strong>{activeProfile?.email || session.user.email}</strong></div>
              <div><span>WhatsApp</span><strong>{activeProfile?.whatsapp || "WhatsApp not added"}</strong></div>
            </div>
            <div className="card-footer">
              <Link className="button secondary" href="/account">Edit account</Link>
            </div>
          </section>

          <section className="result-panel">
            <p className="eyebrow">Report credits</p>
            <h2>Credit balance</h2>
            <div className="credit-list">
              {(summary?.credits || []).slice(0, 4).map((credit) => (
                <div className="credit-row" key={credit.id}>
                  <CreditCard size={18} aria-hidden="true" />
                  <span>{Math.max(0, credit.credits_total - credit.credits_used)} of {credit.credits_total} left</span>
                  <span className={`status-pill ${credit.status}`}>{credit.status}</span>
                </div>
              ))}
              {!summary?.credits.length ? (
                <div className="empty-state">
                  <strong>No credits yet</strong>
                  <span>Choose a paid report plan when you are ready to unlock a PDF.</span>
                  <Link className="button secondary" href="/pricing">Buy report credits</Link>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <section className="result-panel">
          <p className="eyebrow">Orders</p>
          <h2>Payment orders</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(summary?.orders || []).slice(0, 8).map((order) => (
                  <tr key={order.id}>
                    <td>{order.plan?.name || order.plan_id}</td>
                    <td>Rs. {order.amount_pkr.toLocaleString()}</td>
                    <td><span className={`status-pill ${order.status}`}>{order.status}</span></td>
                    <td>{formatDate(order.created_at)}</td>
                    <td><Link href={`/dashboard/payment/${order.id}`}>Open</Link></td>
                  </tr>
                ))}
                {!summary?.orders.length ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <strong>No orders yet</strong>
                        <span>Your paid report requests will appear here.</span>
                        <Link className="button secondary" href="/pricing">View pricing</Link>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="result-panel">
          <p className="eyebrow">Recent reports</p>
          <h2>PDF unlock history</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 8).map((report) => (
                  <tr key={report.id}>
                    <td>{report.filename}</td>
                    <td>{report.mode}</td>
                    <td>{report.pdf_unlocked ? "PDF unlocked" : "Free scan"}</td>
                    <td>{formatDate(report.created_at)}</td>
                  </tr>
                ))}
                {!reports.length ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">
                        <strong>No reports yet</strong>
                        <span>Run a free scan first, then unlock a PDF with a report credit.</span>
                        <Link className="button secondary" href="/free-scan">Generate free report</Link>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", { dateStyle: "medium" }).format(new Date(value));
}
