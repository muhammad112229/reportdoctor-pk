import type { Metadata } from "next";
import Link from "next/link";
import { Download, MessageCircle } from "lucide-react";
import { templates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Excel and CSV Templates",
  description:
    "Download starter CSV templates for sales, inventory, expenses, customers, and surveys for ReportDoctor.pk analysis."
};

export default function TemplatesPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Templates</p>
          <h1>Clean starter files for better reports</h1>
          <p>
            Download a CSV template, open it in Excel or Google Sheets, and fill your data using consistent column names.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="card-grid">
          {templates.map((template) => (
            <article className="tool-card" key={template.name}>
              <h2>{template.name}</h2>
              <p>{template.description}</p>
              <div className="card-footer">
                <Link className="button primary" href={template.href}>
                  Download CSV
                  <Download size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section two-column">
        <div>
          <p className="eyebrow">Custom templates</p>
          <h2>Need a paid template or setup help?</h2>
          <p className="section-intro">
            Keep payment manual for the MVP: collect requirements, share JazzCash/Easypaisa/bank details, and deliver the
            customized CSV or Excel template after confirmation.
          </p>
        </div>
        <div className="result-panel payment-box">
          <h3>Template setup service</h3>
          <p className="muted">
            Offer paid setup for Daraz exports, shop inventory, academy fee sheets, clinic records, NGO surveys, and monthly
            business reports.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/contact">
              <MessageCircle size={18} aria-hidden="true" />
              Request Template Setup
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
