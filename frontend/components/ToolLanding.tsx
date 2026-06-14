import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ToolPage } from "@/lib/site";
import { FAQSchema } from "@/components/FAQSchema";

export function ToolLanding({ tool }: { tool: ToolPage }) {
  return (
    <>
      <FAQSchema faqs={tool.faq} />
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">{tool.eyebrow}</p>
          <h1>{tool.title}</h1>
          <p>{tool.summary}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/free-scan">
              {tool.primaryAction}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/templates">
              Download Template
            </Link>
          </div>
        </div>
      </section>

      <section className="section two-column">
        <div>
          <p className="eyebrow">Use cases</p>
          <h2>Made for real working files</h2>
          <p className="section-intro">
            Upload the file you already use in Excel. ReportDoctor.pk checks data quality first, then creates summaries and
            practical business explanations.
          </p>
        </div>
        <div className="card-grid two">
          {tool.useCases.map((useCase) => (
            <article className="mini-card" key={useCase}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{useCase}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Included</p>
        <h2>What the report checks</h2>
        <div className="feature-list">
          {tool.features.map((feature) => (
            <div className="feature-row" key={feature}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section faq-section">
        <p className="eyebrow">FAQ</p>
        <h2>Common questions</h2>
        <div className="faq-list">
          {tool.faq.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
