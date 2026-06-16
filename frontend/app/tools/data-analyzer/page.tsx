import type { Metadata } from "next";
import Link from "next/link";
import { AnalyzerClient } from "@/components/AnalyzerClient";
import { FAQSchema } from "@/components/FAQSchema";
import { getToolBySlug } from "@/lib/site";

const tool = getToolBySlug("data-analyzer")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription
};

export default function DataAnalyzerPage() {
  return (
    <>
      <FAQSchema faqs={tool.faq} />
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">{tool.eyebrow}</p>
          <h1>{tool.title}</h1>
          <p>{tool.summary}</p>
          <div className="badge-row">
            <span className="badge">CSV</span>
            <span className="badge">XLSX</span>
            <span className="badge">XLS</span>
            <span className="badge">Beginner Mode</span>
            <span className="badge">Plain-language insights</span>
          </div>
        </div>
      </section>

      <section className="section two-column">
        <div>
          <p className="eyebrow">Upload tool</p>
          <h2>Analyze your file</h2>
          <p className="section-intro">
            Select a business mode, upload your spreadsheet, and review the free scan with diagnosis, dashboard
            recommendations, charts, and AI-style consultant notes.
          </p>
          <p className="muted">
            Sample files are available on the <Link href="/templates">Templates page</Link>.
          </p>
        </div>
        <AnalyzerClient />
      </section>

      <section className="section faq-section">
        <p className="eyebrow">FAQ</p>
        <h2>Before uploading</h2>
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
