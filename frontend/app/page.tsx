import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  Download,
  FileCheck2,
  FileSpreadsheet,
  GraduationCap,
  LineChart,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store
} from "lucide-react";
import { TrustStrip } from "@/components/TrustStrip";
import { blogPosts, pricingTiers, sampleReports, site, templates, toolPages } from "@/lib/site";

const howItWorks = [
  {
    icon: FileSpreadsheet,
    title: "Upload Excel/CSV",
    text: "Choose a CSV, XLSX, or XLS file from your shop, survey, sales, inventory, or finance workflow."
  },
  {
    icon: SearchCheck,
    title: "Get free scan",
    text: "Review missing values, duplicate rows, detected columns, charts, English insights, and Roman Urdu guidance."
  },
  {
    icon: CreditCard,
    title: "Buy report credits",
    text: "If the preview is useful, choose Basic, Business, or Pro and send payment through Easypaisa."
  },
  {
    icon: MessageCircle,
    title: "Send screenshot on WhatsApp",
    text: "Send the payment screenshot to WhatsApp so the report request can be verified manually."
  },
  {
    icon: Sparkles,
    title: "Download with credit",
    text: "After approval, your report credit activates automatically and you can download the full PDF."
  }
];

const audiences = [
  { icon: Store, title: "Shopkeepers", text: "Daily sales, inventory, and expenses in one quick scan." },
  { icon: ShoppingBag, title: "Daraz sellers", text: "Understand orders, products, revenue, and slow movers." },
  { icon: GraduationCap, title: "Academies", text: "Fee sheets, attendance exports, and student records." },
  { icon: Stethoscope, title: "Clinics", text: "Patient visits, service trends, and operational summaries." },
  { icon: BookOpen, title: "Students & researchers", text: "Survey results, missing values, and clean summaries." }
];

const demoPreviews = [
  {
    title: "Free scan result",
    label: "Rows, columns, types, and first insights",
    bars: ["82%", "64%", "38%"]
  },
  {
    title: "Missing values report",
    label: "Blank cells by column with cleanup priorities",
    bars: ["72%", "46%", "18%"]
  },
  {
    title: "Sales report",
    label: "Revenue, top products, order count, and trends",
    bars: ["88%", "58%", "44%"]
  },
  {
    title: "PDF report",
    label: "Downloadable summary with insights and disclaimer",
    bars: ["78%", "68%", "52%"]
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">AI Data Consultant for Pakistani businesses</p>
          <h1>Turn messy Excel files into premium consultant reports</h1>
          <p>
            {site.tagline} Get Data Doctor Diagnosis, Business Health Score, smart dashboards, charts, and an Ask My
            Data assistant before unlocking a polished consultant-grade PDF.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/free-scan">
              Generate Free Report
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/sample-reports">
              View Sample Report
            </Link>
          </div>
          <div className="hero-proof">
            <span>No signup for Free Scan</span>
            <span>Data Doctor Diagnosis</span>
            <span>Ask My Data</span>
            <span>Premium PDF</span>
          </div>
        </div>
        <div className="hero-product">
          <Image
            src="/branding/hero-cover.png"
            alt="ReportDoctor AI Data Consultant dashboard for Excel and CSV reports"
            width={1680}
            height={900}
            priority
            sizes="(max-width: 980px) 100vw, 48vw"
          />
        </div>
      </section>

      <TrustStrip />

      <section className="section">
        <p className="eyebrow">How it works</p>
        <h2>Free scan first, unlock the PDF only when it helps</h2>
        <div className="steps-grid">
          {howItWorks.map(({ icon: Icon, title, text }, index) => (
            <article className="step-card" key={title}>
              <span>{index + 1}</span>
              <Icon size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Who can use it?</p>
        <h2>Built for practical teams, owners, and researchers</h2>
        <div className="audience-grid">
          {audiences.map(({ icon: Icon, title, text }) => (
            <article className="audience-card" key={title}>
              <Icon size={22} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">What it does</p>
        <h2>From spreadsheet to AI-style data consultant</h2>
        <div className="card-grid">
          {[
            {
              icon: FileSpreadsheet,
              title: "Upload Excel or CSV",
              text: "Use files from shops, Daraz, Google Forms, clinics, academies, NGOs, or manual ledgers."
            },
            {
              icon: Stethoscope,
              title: "Data Doctor Diagnosis",
              text: "See health score, severity, missing values, duplicates, weak columns, outliers, and a practical cleanup prescription."
            },
            {
              icon: LineChart,
              title: "Smart dashboard builder",
              text: "Get recommended KPIs, chart strategy, business health signals, and an Ask My Data assistant without a paid AI API."
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
          <p className="eyebrow">Sample report preview</p>
          <h2>See the kind of report your file can produce</h2>
          <p className="section-intro">
            ReportDoctor.pk starts with a free scan so users can check the quality of their file before paying. The full PDF
            report can include an executive summary, KPI snapshot, Data Doctor Diagnosis, Business Health Score, chart
            explanations, risks, opportunities, recommended actions, and a 30-day action plan.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/sample-reports">
              View Sample Reports
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/free-scan">
              Generate Free Report
            </Link>
          </div>
        </div>
        <div className="report-preview">
          <div className="report-preview-header">
            <FileCheck2 size={24} aria-hidden="true" />
            <div>
              <strong>ReportDoctor.pk PDF</strong>
              <span>Data quality, charts, insights, recommendations</span>
            </div>
          </div>
          <div className="report-preview-grid">
            <div>
              <span>Missing cells</span>
              <strong>1</strong>
            </div>
            <div>
              <span>Duplicate rows</span>
              <strong>1</strong>
            </div>
            <div>
              <span>Charts</span>
              <strong>2+</strong>
            </div>
          </div>
          <div className="report-preview-lines">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Demo placeholders</p>
        <h2>What users see after upload</h2>
        <div className="demo-preview-grid">
          {demoPreviews.map((preview) => (
            <article className="demo-shot" key={preview.title}>
              <div className="demo-shot-top">
                <span />
                <span />
                <span />
              </div>
              <h3>{preview.title}</h3>
              <p>{preview.label}</p>
              <div className="demo-bars">
                {preview.bars.map((width) => (
                  <span style={{ width }} key={width} />
                ))}
              </div>
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
            MVP. Please do not upload highly sensitive personal, banking, medical, legal, or confidential files. Reports are
            automatically generated and should be reviewed before business decisions.
          </p>
        </div>
        <div className="feature-list">
          {[
            "No signup required for free scan",
            "Files are processed for analysis only",
            "Do not upload highly sensitive personal or banking files",
            "Reports should be reviewed before business decisions"
          ].map((item) => (
            <div className="feature-row" key={item}>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
