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
          <h1>Start free, unlock full PDF reports manually</h1>
          <p>
            Run the free scan first. If the preview is useful, choose a paid plan, send Easypaisa payment, and report
            credits activate after WhatsApp screenshot approval.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="status-box">
          Payment note: Easypaisa payment ke baad screenshot WhatsApp par bhejein. Verification ke baad full report unlock
          credit activate ho jayega.
        </div>
      </section>
      <section className="section">
        <PricingClient />
      </section>
    </>
  );
}
