import type { Metadata } from "next";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "ReportDoctor.pk pricing for Free Scan, Basic Report, Business Report, and Pro Consultant Report credits."
};

export default function PricingPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Pricing</p>
          <h1>Simple report credits for every file size</h1>
          <p>
            Run the free scan first. If the preview is useful, choose a paid plan to unlock the full AI consultant report,
            dashboard, action plan, and PDF. Manual local payment support is available during launch.
          </p>
        </div>
      </section>
      <section className="section pricing-note-section">
        <div className="status-box">
          International checkout coming soon. Easypaisa and WhatsApp verification remain available as temporary launch support.
        </div>
      </section>
      <section className="section">
        <PricingClient />
        <div className="comparison-panel">
          <p className="eyebrow">Compare plans</p>
          <h2>What each paid plan unlocks</h2>
          <div>
            <div className="comparison-row"><strong>Basic</strong><span>1 credit for a full consultant-style PDF report.</span></div>
            <div className="comparison-row"><strong>Business</strong><span>3 credits with full dashboard, diagnosis, and action plan access.</span></div>
            <div className="comparison-row"><strong>Pro</strong><span>7 credits for recurring reports, priority manual verification, and setup support.</span></div>
            <div className="comparison-row"><strong>Payment</strong><span>Local manual verification now; international checkout coming soon.</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
