import Link from "next/link";
import { ArrowRight, Download, FileSpreadsheet, LineChart, ShieldCheck } from "lucide-react";
import { TrustStrip } from "@/components/TrustStrip";
import { blogPosts, pricingTiers, sampleReports, site, templates, toolPages } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Data reports for Pakistani businesses</p>
          <h1>{site.name}</h1>
          <p>
            {site.tagline} Upload CSV or Excel files and get data quality checks, charts, business insights, and a
            professional PDF report workflow.
          </p>
          <div className="hero-actions">
            <Link className="button secondary" href="/free-scan">
              Upload Excel/CSV File
            </Link>
            <Link className="button primary" href="/free-scan">
              Generate Free Report
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/sample-reports">
              View Sample Reports
            </Link>
          </div>
          <p className="hero-footnote">Roman Urdu support: file upload karein, report samjhein, next steps follow karein.</p>
        </div>
      </section>

      <TrustStrip />

      <section className="section">
        <p className="eyebrow">What it does</p>
        <h2>From spreadsheet to business report</h2>
        <div className="card-grid">
          {[
            {
              icon: FileSpreadsheet,
              title: "Upload Excel or CSV",
              text: "Use files from shops, Daraz, Google Forms, clinics, academies, NGOs, or manual ledgers."
            },
            {
              icon: LineChart,
              title: "Get charts and insights",
              text: "See missing values, duplicates, summaries, trends, top products, inventory risks, and survey patterns."
            },
            {
              icon: Download,
              title: "Download PDF report",
              text: "Free scan is instant. Full PDF report is connected to a manual payment workflow for the MVP."
            }
          ].map(({ icon: Icon, title, text }) => (
            <article className="card" key={title}>
              <Icon size={28} color="#0f766e" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column">
        <div>
          <p className="eyebrow">Tools</p>
          <h2>Focused report generators</h2>
          <p className="section-intro">
            Choose a business mode or start with the general analyzer. Beginner Mode helps map columns like date, amount,
            product, customer, stock, and cost.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/tools">
              Explore Tools
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="card-grid two">
          {toolPages.slice(0, 6).map((tool) => (
            <Link className="mini-card" href={`/tools/${tool.slug}`} key={tool.slug}>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>{tool.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Ready files</p>
        <h2>Templates and examples</h2>
        <div className="card-grid">
          <article className="tool-card">
            <h3>Sample reports</h3>
            <p>{sampleReports.length} starter examples for sales, inventory, academy fees, clinics, and Daraz sellers.</p>
            <div className="card-footer">
              <Link className="button secondary" href="/sample-reports">
                View Samples
              </Link>
            </div>
          </article>
          <article className="tool-card">
            <h3>Downloadable templates</h3>
            <p>{templates.length} clean CSV templates so beginners can prepare files in the right structure.</p>
            <div className="card-footer">
              <Link className="button secondary" href="/templates">
                Get Templates
              </Link>
            </div>
          </article>
          <article className="tool-card">
            <h3>Learning guides</h3>
            <p>{blogPosts.length} practical SEO articles about Excel reports, CSV files, missing values, duplicates, and more.</p>
            <div className="card-footer">
              <Link className="button secondary" href="/learn">
                Read Guides
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Pricing preview</p>
        <h2>Free scan first, full PDF when needed</h2>
        <div className="card-grid">
          {pricingTiers.map((tier) => (
            <article className="price-card" key={tier.name}>
              <p className="eyebrow">{tier.name}</p>
              <h3>{tier.price}</h3>
              <p>{tier.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column">
        <div>
          <p className="eyebrow">Trust and privacy</p>
          <h2>Built for practical MVP privacy</h2>
          <p className="section-intro">
            Uploaded files are processed by the backend for analysis and are not designed to be stored permanently in the
            MVP. Reports are informational and should be reviewed before business decisions.
          </p>
        </div>
        <div className="feature-list">
          {["No signup for free scan", "Manual payment option", "Beginner-friendly Roman Urdu guidance", "Clear disclaimer in PDF reports"].map(
            (item) => (
              <div className="feature-row" key={item}>
                <span>{item}</span>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
