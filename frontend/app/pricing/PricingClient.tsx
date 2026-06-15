"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchJson } from "@/lib/api";
import { pricingTiers } from "@/lib/site";

type CreateOrderResponse = {
  order: {
    id: string;
  };
};

export function PricingClient() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [creatingPlanId, setCreatingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function selectPlan(plan: (typeof pricingTiers)[number]) {
    setError(null);

    if (!plan.isPaid) {
      router.push("/free-scan");
      return;
    }

    if (!session) {
      router.push("/signin?next=/pricing");
      return;
    }

    setCreatingPlanId(plan.id);
    try {
      const data = await fetchJson<CreateOrderResponse>("/orders", session, {
        method: "POST",
        body: JSON.stringify({ plan_id: plan.id })
      });
      router.push(`/dashboard/payment/${data.order.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create your payment order.");
    } finally {
      setCreatingPlanId(null);
    }
  }

  return (
    <>
      {error ? <div className="status-box error">{error}</div> : null}
      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <article className={`price-card ${tier.id === "business-report" ? "recommended" : ""}`} key={tier.name}>
            {tier.id === "business-report" ? <span className="recommendation-badge">Recommended</span> : null}
            <p className="eyebrow">{tier.name}</p>
            <h2>{tier.price}</h2>
            <p>{tier.description}</p>
            <div className="badge-row">
              <span className="badge">{tier.credits} report credits</span>
            </div>
            <div className="feature-list">
              {tier.features.map((feature) => (
                <div className="feature-row" key={feature}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <button
                className={`button ${tier.id === "business-report" ? "primary" : "secondary"}`}
                type="button"
                onClick={() => selectPlan(tier)}
                disabled={loading || creatingPlanId === tier.id}
              >
                {creatingPlanId === tier.id ? (
                  <Loader2 className="spin" size={18} aria-hidden="true" />
                ) : (
                  <ArrowRight size={18} aria-hidden="true" />
                )}
                {creatingPlanId === tier.id ? "Creating order" : tier.action}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
