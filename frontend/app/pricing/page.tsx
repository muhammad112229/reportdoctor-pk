import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { pricingTiers } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "ReportDoctor.pk pricing for free scans, Basic PDF Reports, Business Reports, and Pro Reports with Easypaisa payment and WhatsApp unlock code verification."
};

export default function PricingPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Pricing</p>
          <h1>Start free, unlock full PDF reports manually</h1>
          <p>
            Run the free scan first. If the preview is useful, payment is handled through Easypaisa and the unlock code is
            sent after WhatsApp screenshot verification.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="status-box">
          Payment note: Easypaisa payment ke baad screenshot WhatsApp par bhejein. Verification ke baad full report unlock
          code diya jayega.
        </div>
      </section>
      <section className="section">
        <div className="card-grid">
          {pricingTiers.map((tier) => (
            <article className="price-card" key={tier.name}>
              <p className="eyebrow">{tier.name}</p>
              <h2>{tier.price}</h2>
              <p>{tier.description}</p>
              <div className="feature-list">
                {tier.features.map((feature) => (
                  <div className="feature-row" key={feature}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <Link className="button primary" href="/free-scan">
                  {tier.action}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
