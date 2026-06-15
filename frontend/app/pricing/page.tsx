import type { Metadata } from "next";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "ReportDoctor.pk pricing for free scans, Basic PDF Reports, Business Reports, and Pro Reports with Easypaisa payment and WhatsApp approval."
};

export default function PricingPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Pricing</p>
          <h1>Simple report credits for every file size</h1>
          <p>
            Run the free scan first. If the preview is useful, choose a paid plan, send Easypaisa payment, and report
            credits activate after WhatsApp screenshot approval.
          </p>
        </div>
      </section>
      <section className="section pricing-note-section">
        <div className="status-box">
          Payment through Easypaisa. Send screenshot on WhatsApp for approval.
        </div>
      </section>
      <section className="section">
        <PricingClient />
        <div className="comparison-panel">
          <p className="eyebrow">Compare plans</p>
          <h2>What each paid plan unlocks</h2>
          <div>
            <div className="comparison-row"><strong>Basic</strong><span>1 PDF report credit for simple sharing.</span></div>
            <div className="comparison-row"><strong>Business</strong><span>3 credits with deeper business mode reporting.</span></div>
            <div className="comparison-row"><strong>Pro</strong><span>7 credits for priority workflows and support.</span></div>
            <div className="comparison-row"><strong>Payment</strong><span>Easypaisa verification and automatic credit activation.</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
