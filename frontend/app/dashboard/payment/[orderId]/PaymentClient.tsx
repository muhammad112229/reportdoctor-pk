"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import type { Order } from "@/lib/accountTypes";
import { fetchJson } from "@/lib/api";
import { paymentOptions } from "@/lib/site";
import { supabase } from "@/lib/supabase";

type OrderResponse = {
  order: Order;
};

export function PaymentClient() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const { session, loading, profile, refreshAccountData } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [followUpWhatsApp, setFollowUpWhatsApp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session) {
      router.replace(`/signin?next=/dashboard/payment/${params.orderId}`);
      return;
    }
    setFetching(true);
    fetchJson<OrderResponse>(`/orders/${params.orderId}`, session)
      .then((data) => setOrder(data.order))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load this payment order. Please refresh and try again."))
      .finally(() => setFetching(false));
  }, [loading, params.orderId, router, session]);

  useEffect(() => {
    setFollowUpWhatsApp(profile?.whatsapp || "");
  }, [profile?.whatsapp]);

  async function markSent() {
    if (!session || !order) {
      return;
    }
    setError(null);
    setStatus(null);
    setSubmitting(true);
    try {
      const data = await fetchJson<OrderResponse>(`/orders/${order.id}/sent`, session, { method: "POST" });
      setOrder(data.order);
      const cleanWhatsApp = followUpWhatsApp.trim();
      if (cleanWhatsApp) {
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: session.user.id,
            full_name: profile?.full_name || session.user.user_metadata?.full_name || null,
            email: session.user.email || profile?.email || null,
            whatsapp: cleanWhatsApp,
            role: profile?.role || "user"
          },
          { onConflict: "id" }
        );
        if (profileError) {
          setStatus("Payment proof note saved, but the follow-up number could not be saved.");
          return;
        }
        await refreshAccountData();
      }
      setStatus("Payment proof note saved. Your report credit will activate after admin approval.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not mark payment proof as sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || fetching) {
    return (
      <section className="section">
        <div className="status-box">
          <Loader2 className="spin" size={18} aria-hidden="true" />
          Loading payment order...
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="section">
        <div className="status-box error">{error || "Order not found."}</div>
      </section>
    );
  }

  const whatsappUrl = `https://wa.me/${paymentOptions.whatsapp}`;

  return (
    <>
      <section className="page-hero portal-hero">
        <div>
          <p className="eyebrow">Payment order</p>
          <h1>{order.plan?.name || order.plan_id}</h1>
          <p>Send payment proof through the launch support channel. Your report credits activate after admin approval.</p>
          <div className="badge-row">
            <span className="badge">Status: {order.status}</span>
            <span className="badge">Amount: Rs. {order.amount_pkr.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="section portal-section dashboard-grid">
        <div className="result-panel payment-box">
          <p className="eyebrow">Launch payment support</p>
          <h2>Send payment proof</h2>
          <div className="detail-list">
            <div><span>Selected plan</span><strong>{order.plan?.name || order.plan_id}</strong></div>
            <div><span>Amount</span><strong>Rs. {order.amount_pkr.toLocaleString()}</strong></div>
            <div><span>Easypaisa number</span><strong>{paymentOptions.easypaisa}</strong></div>
            <div><span>Payment/support WhatsApp</span><strong>+{paymentOptions.whatsapp}</strong></div>
            <div><span>Order status</span><strong>{order.status}</strong></div>
          </div>
          <div className="field">
            <label htmlFor="payment-followup-whatsapp">Your WhatsApp number for payment follow-up (optional)</label>
            <input
              id="payment-followup-whatsapp"
              type="tel"
              autoComplete="tel"
              value={followUpWhatsApp}
              onChange={(event) => setFollowUpWhatsApp(event.target.value)}
              placeholder="923100906678"
            />
          </div>
          {status ? <div className="status-box">{status}</div> : null}
          {error ? <div className="status-box error">{error}</div> : null}
          <div className="hero-actions">
            <a className="button primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              Send proof on WhatsApp
            </a>
            <button className="button secondary" type="button" onClick={markSent} disabled={submitting || order.status === "approved"}>
              {submitting ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
              I have sent payment proof
            </button>
          </div>
        </div>

        <div className="result-panel">
          <p className="eyebrow">Next step</p>
          <h2>What happens now?</h2>
          <ul className="insight-list">
            <li>Admin will verify the payment proof.</li>
            <li>Approved orders add report credits to your account automatically.</li>
            <li>Rejected orders show an admin note if more detail is needed.</li>
            <li>International checkout is coming soon.</li>
          </ul>
          <div className="card-footer">
            <Link className="button ghost" href="/dashboard">Back to dashboard</Link>
          </div>
        </div>
      </section>
    </>
  );
}
