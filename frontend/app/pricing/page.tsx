import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { pricingTiers } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "ReportDoctor.pk MVP pricing with free scans, single full reports, and monthly business report options through manual payment."
};

export default function PricingPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Pricing</p>
          <h1>Start free, unlock full PDF reports manually</h1>
          <p>
            The MVP uses JazzCash, Easypaisa, or bank transfer placeholders. Update payment details in environment
            variables and README instructions when going live.
          </p>
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
                <Link className="button primary" href={tier.name === "Free Scan" ? "/free-scan" : "/contact"}>
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
