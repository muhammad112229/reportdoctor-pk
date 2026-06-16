import Link from "next/link";
import { ArrowRight, CheckCircle2, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { FAQSchema } from "@/components/FAQSchema";
import type { SeoLandingPage } from "@/lib/seoLanding";

export function SEOLanding({ page }: { page: SeoLandingPage }) {
  return (
    <>
      <FAQSchema faqs={page.faqs} />
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.summary}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/free-scan">
              Start Free Scan
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/sample-reports">
              View Sample Reports
            </Link>
          </div>
        </div>
      </section>

      <section className="section article-body">
        <p className="eyebrow">Guide</p>
        <h2>Use {page.primaryKeyword} before making business decisions</h2>
        <p>
          A spreadsheet can look simple, but the numbers inside it often decide purchasing, pricing, staffing, marketing,
          and customer follow-up. {page.title} helps {page.audience} review files before a report is trusted. Instead of
          jumping straight to totals, the first step is to check whether the file structure is clean enough for analysis.
          A file with duplicate rows, blank values, unclear headings, or mixed number formats can produce charts that look
          professional while still being wrong.
        </p>
        <p>
          ReportDoctor.pk is designed for practical Excel and CSV files that people already use every day. Typical uploads
          include {joinList(page.fileExamples)}. The scan looks at common fields such as {joinList(page.columns)} and then
          explains what was found. This is useful when a file comes from a marketplace, a POS system, Google Forms, a
          manual ledger, or a monthly spreadsheet maintained by several people.
        </p>
        <p>
          The free scan is a fast first review. It shows the dataset size, column profile, Data Doctor Diagnosis, Smart
          Dashboard recommendations, charts, and plain-language insights. If the report is useful, paid report credits
          unlock the full PDF. Manual local payment support is available during launch, with international checkout coming soon.
        </p>
      </section>

      <section className="section two-column">
        <div>
          <p className="eyebrow">What it checks</p>
          <h2>Data quality first, report second</h2>
          <p className="section-intro">
            Good reports start with basic checks. For this page, the most important checks include {joinList(page.checks)}.
            These checks help users decide whether the report is ready to share or whether the source file needs cleanup.
          </p>
          <p className="section-intro">
            Common mistakes include {joinList(page.mistakes)}. ReportDoctor.pk does not silently change your data. It
            points out risks so you can review the original spreadsheet, fix the source if needed, and run the scan again.
          </p>
        </div>
        <div className="feature-list">
          {page.checks.map((check) => (
            <div className="feature-row" key={check}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{capitalize(check)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Workflow</p>
        <h2>From uploaded file to consultant PDF</h2>
        <div className="steps-grid">
          {[
            ["Upload Excel/CSV", "Choose a spreadsheet up to 10 MB and select the closest business mode."],
            ["Get free scan", "Review missing values, duplicate rows, charts, and beginner guidance."],
            ["Choose report credits", "Select a paid plan when the free scan confirms the report is useful."],
            ["Use launch payment support", "Manual Easypaisa and WhatsApp verification are available while international checkout is prepared."],
            ["Download full PDF", "Use an approved report credit to download the consultant-grade PDF report."]
          ].map(([title, text], index) => (
            <article className="step-card" key={title}>
              <span>{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section article-body">
        <p className="eyebrow">Practical use</p>
        <h2>What a useful report should tell you</h2>
        <p>
          A useful report should answer simple questions. How many rows and columns are in the file? Which columns look
          numeric, categorical, date-based, or text-based? Are important fields blank? Are repeated rows inflating counts?
          Which categories appear most often? Are there columns that can support charts or monthly trends? The answers help
          users move from raw spreadsheet data to a decision-ready view.
        </p>
        <p>
          For {page.primaryKeyword}, the main outcomes are {joinList(page.outcomes)}. These outcomes matter because most
          small teams do not need a complicated dashboard at the start. They need a quick way to understand whether the file
          is clean, what the most important numbers mean, and whether a PDF report is worth purchasing.
        </p>
        <p>
          The paid report flow is intentionally simple for launch. A user can run the free scan without signup, decide
          whether the result is useful, and use a report credit for the full PDF. Manual Easypaisa and WhatsApp verification
          remain available as temporary local support while international checkout is prepared.
        </p>
      </section>

      <section className="section two-column">
        <div>
          <p className="eyebrow">Trust notes</p>
          <h2>Launch-safe expectations</h2>
          <p className="section-intro">
            No signup is required for the free scan. Files are processed for analysis only, but users should avoid uploading
            highly sensitive personal, banking, medical, legal, or confidential files unless they are comfortable doing so.
            Raw files are not sent to external AI by default. Automatically generated reports are analytical support, not
            financial, legal, medical, tax, or accounting advice.
          </p>
        </div>
        <div className="feature-list">
          {[
            "No signup required for free scan",
            "Files are processed for analysis only",
            "Raw files are not sent to external AI by default",
            "Review reports before professional decisions"
          ].map((item) => (
            <div className="feature-row" key={item}>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Related tools</p>
        <h2>Continue with the right workflow</h2>
        <div className="card-grid">
          {page.related.map((item) => (
            <Link className="tool-card" href={item.href} key={item.href}>
              <FileSpreadsheet size={24} color="#0f766e" aria-hidden="true" />
              <h3>{item.label}</h3>
              <p>Open this related ReportDoctor.pk page to keep the analysis flow moving.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section faq-section">
        <p className="eyebrow">FAQ</p>
        <h2>Common questions</h2>
        <div className="faq-list">
          {page.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section final-cta">
        <p className="eyebrow">Try it</p>
        <h2>Upload your file and get a free scan</h2>
        <p className="section-intro">
          Start with the free scan, review the data quality warnings, and request the full PDF report only when the preview
          is useful for your work.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/free-scan">
            Generate Free Report
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className="button secondary" href="/pricing">
            View Pricing
          </Link>
        </div>
      </section>
    </>
  );
}

function joinList(items: string[]) {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}` : items[0] || "";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
